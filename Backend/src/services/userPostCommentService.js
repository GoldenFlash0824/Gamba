import dotenv from 'dotenv'
import NotificationMessage from '../enums/notification-message.js'
import NotificationEnum from '../enums/notification-type-enum.js'
dotenv.config()
import db from '../models/index.js'
import { sendNotification } from '../notification/sendNotification.js'
import { getUserIdFromToken } from '../utilities/authentication.js'
import { commentPosterEmail, notificationEmail } from './emailService.js'
import { blockedUser, facetStage } from './userService.js'
import { deleteImage, s3SharpImageUpload } from './aws.js'

const addUserPostComment = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let user = await db.User.findOne({ id: u_id })
        let { p_id, comment, page, order, imageData } = req.body
        const timeStamp = Date.now()
        const post = await db.Posts.findOne({
            where: { id: p_id },

            include: [
                {
                    association: 'user'
                }
            ]
        })

        if (post) {
            let image;
            if (imageData) {
                image = await s3SharpImageUpload(imageData)
            }

            const addPostComment = await db.UserPostComment.create({ u_id: u_id, p_id: p_id, comment: comment, time: timeStamp, image: image ? image : '' })

            if (u_id != post.u_id) {
                await db.notification.create({
                    u_id: u_id,
                    post_id: p_id,
                    type: NotificationEnum.COMMENT_Post,
                    f_id: post.u_id,
                    message: NotificationMessage.COMMENT
                })

                let check_email_notification = await db.notificationSetting.findOne({
                    where: {
                        u_id: post.u_id
                    },
                    raw: true
                })

                if (check_email_notification?.email_notification == true) {
                    let user_that_comment_on_post = await db.User.findOne({ where: { id: u_id }, raw: true })
                    let email_of_owner_post = await db.User.findOne({ where: { id: post.u_id }, raw: true })

                    await notificationEmail(email_of_owner_post.email, user_that_comment_on_post.first_name, NotificationMessage.COMMENT)
                }

                if (check_email_notification?.sms_notification == true) {
                    // let user_that_like_post = await db.User.findOne({where: {id: u_id}, raw: true})
                    // let phone_of_owner_post = await db.User.findOne({where: {id: post.u_id}, raw: true})
                    // let info = await smsNotification(phone_of_owner_post.phone, user_that_like_post.first_name, NotificationMessage.COMMENT)
                    // console.log('sms send to comment post', info)
                }

                if (post?.user?.fcm_token) {
                    let message = {
                        token: post?.user?.fcm_token,
                        notification: {
                            title: `Comment Post`,
                            body: `${user?.first_name + ' ' + user?.last_name} comment on  your post`
                        },
                        data: { data: JSON.stringify(post) }
                    }
                    await sendNotification(message)
                }
            }

            if (addPostComment) {
                const requestData = { p_id: p_id, page: page, order: order }
                const allcomments = await viewAllPostComments(req, requestData);
                await commentPosterEmail(post.user, post.user.email);
                return {
                    status: true,
                    message: 'Comment added successfully',
                    data: { comment: allcomments.data }
                }
            }
            return {
                status: false,
                message: 'Comment not added'
            }
        }
        return {
            status: false,
            message: 'Something went wrong. Please try again later.'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteUserPostComment = async (req) => {
    try {
        const { id } = req.body
        const findUserComment = await db.UserPostComment.findOne({ where: { id: id } })
        if (findUserComment) {
            if (findUserComment?.media) {
                await deleteImage(findUserComment?.image)
            }
            let replies = await db.UserPostReply.findAll({ where: { c_id: id }, raw: true })
            if (replies?.length) {
                for (let i = 0; i < replies?.length; i++) {
                    replies[i]?.image && (await deleteImage(replies[i]?.image))
                }
            }
            const response = await Promise.all([db.UserPostReply.destroy({ where: { c_id: id } }), db.UserLikeComment.destroy({ where: { c_id: id } }), db.UserPostComment.destroy({ where: { id: id } })])
            if (response) {
                return {
                    data: true,
                    status: true,
                    message: 'Comment deleted successfully'
                }
            }
        }
        return {
            status: false,
            message: 'Comment not deleted '
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const updateUserPostComment = async (req) => {
    try {
        let { id, comment, page, order, imageData } = req.body
        const timeStamp = Date.now()
        const getComment = await db.UserPostComment.findOne({ where: { id: id } })
        if (getComment) {
            if (getComment?.image && imageData) {
                await deleteImage(getComment?.image)
            }

            if (imageData) {
                imageData = await s3SharpImageUpload(imageData)
            }
            const updateComment = await db.UserPostComment.update({ comment: comment, time: timeStamp, image: imageData ? imageData : getComment?.image }, { where: { id: id } })
            if (updateComment) {
                const requestData = { p_id: getComment?.p_id, page: page, order: order }
                const allcomments = await viewAllPostComments(req, requestData)
                return {
                    status: true,
                    message: 'Comment updated successfully',
                    data: { comment: allcomments.data?.allComments }
                }
            }
            return {
                status: false,
                message: 'Comment not updated'
            }
        }
        return {
            status: false,
            message: 'Something went wrong. Please try again later.'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const viewAllPostComments = async (req, requestData) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { p_id, page, order } = req.body || requestData
        const { limit, offset } = await facetStage(page)
        const existPost = await db.Posts.findOne({ where: { id: requestData?.p_id ? requestData?.p_id : p_id } })
        if (existPost) {
            const allPostComments = await db.UserPostComment.findAll({
                limit: limit,
                offset: offset,
                where: { p_id: existPost.id },
                order: [['time', order]],
                include: [
                    { association: 'likeComment' },

                    { association: 'dislikeComment' },

                    {
                        association: 'replies',
                        include: [
                            // {
                            //     association: 'likeReply'
                            // },
                            { association: 'repliedUser', attributes: ['id', 'first_name', 'last_name', 'image'] }
                        ],
                        attributes: {
                            include: [
                                [db.sequelize.literal(`(SELECT COUNT(*) FROM commentLikes WHERE r_id = replies.id)`), 'likes'],
                                [db.sequelize.literal(`(SELECT COUNT(*) FROM disLikecomments WHERE r_id = replies.id)`), 'dislikes'],
                                [db.sequelize.literal(`EXISTS(SELECT * FROM commentLikes WHERE r_id = replies.id AND u_id = ${u_id ? u_id : -1})`), 'isLiked'],
                                [db.sequelize.literal(`EXISTS(SELECT * FROM disLikecomments WHERE r_id = replies.id AND u_id = ${u_id ? u_id : -1})`), 'isDislike'],
                                [db.sequelize.literal(`EXISTS(SELECT * FROM userPostReplies WHERE id = replies.id AND u_id = ${u_id ? u_id : -1})`), 'isMeReply']
                            ]
                        }
                    }
                ],
                attributes: {
                    include: [
                        [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = ${existPost.id})`), 'total_post_likes'],

                        [db.sequelize.literal(`(SELECT COUNT(*) FROM userPostComments WHERE p_id = ${existPost.id})`), 'total_post_comments'],
                        [db.sequelize.literal(`EXISTS(SELECT * FROM userLikes WHERE post_id = ${existPost.id} AND u_id = ${u_id})`), 'isPostLiked']
                    ]
                }
            })

            if (allPostComments) {
                const allPostCommentArray = []
                for (const comment of allPostComments) {
                    let isMeLike = comment.likeComment.some((like) => like['u_id'] === u_id)
                    let isMeDisLike = comment.dislikeComment.some((like) => like['u_id'] === u_id)
                    let isMeComment = comment['u_id'] === u_id

                    const user = await db.User.findOne({ where: { id: comment.u_id } })
                    const is_blocked = await blockedUser(existPost?.u_id, comment.u_id)
                    if (user && !is_blocked) {
                        const commentData = {
                            _id: comment.time,
                            id: comment.id,
                            text: comment.comment,
                            reply: comment.replies,
                            likes: comment.likeComment.length,
                            dislikes: comment.dislikeComment?.length,
                            isLiked: isMeLike,
                            isMeDisLike: isMeDisLike,
                            isMeComment: isMeComment,
                            postComments: comment?.dataValues?.total_post_comments,
                            postLikes: comment?.dataValues?.total_post_likes,
                            isPostLike: comment?.dataValues?.isPostLiked,
                            // .toLocaleString('en-US', {timeZone: 'America/Chicago'})
                            createdAt: new Date(comment.time),
                            media: comment?.image,
                            user: {
                                _id: user.id,
                                p_id: comment.p_id,
                                user_name: user.user_name,
                                lat: user?.lat,
                                lng: user?.lng,
                                location: user?.address,
                                name: user.first_name + ' ' + user.last_name,
                                avatar: user.image ? `${process.env.S3_URL}${user?.image}` : null
                            }
                        }
                        allPostCommentArray.push(commentData)
                    }
                }
                return {
                    status: true,
                    messsage: 'View comments',
                    data: { allComments: allPostCommentArray }
                }
            }
            return {
                status: false,
                messsage: 'No comments'
            }
        }
        return {
            status: false,
            message: 'Something went wrong. Please try again later.'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deletePostComment = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { c_id, p_id } = req.body

        const existPost = await db.Posts.findOne({ where: { id: p_id } })

        if (existPost) {
            const findUserComment = await db.UserPostComment.findOne({ where: { id: c_id } })
            if (findUserComment) {
                if (findUserComment?.u_id == u_id || existPost.u_id == u_id) {
                    const response = await Promise.all([db.UserPostReply.destroy({ where: { c_id: c_id } }), db.UserLikeComment.destroy({ where: { c_id: c_id } }), db.UserPostComment.destroy({ where: { id: c_id } })])
                    console.log('==================================== response', response)
                    if (response) {
                        return {
                            status: true,
                            message: 'Comment deleted successfully'
                        }
                    }
                }
                return {
                    status: false,
                    message: 'you cannot delete this comment'
                }
            }
            return {
                status: false,
                message: 'You cant delete this comment'
            }
        }
        return {
            status: false,
            message: 'Post not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

export { deletePostComment, addUserPostComment, deleteUserPostComment, updateUserPostComment, viewAllPostComments }
