import dotenv from 'dotenv'
dotenv.config()
import db from '../models/index.js'
import { getUserIdFromToken } from '../utilities/authentication.js'
import { viewAllPostComments } from './userPostCommentService.js'
import { deleteImage, s3SharpImageUpload } from './aws.js'
import { notificationEmail, replyCommentEmail } from './emailService.js'
import { sendNotification } from '../notification/sendNotification.js'
import NotificationMessage from '../enums/notification-message.js'
import NotificationEnum from '../enums/notification-type-enum.js'

const addUserPostReply = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)

        let { p_id, c_id, page, order, reply, imageData } = req.body
        const timeStamp = Date.now()
        const existPost = await db.Posts.findOne({
            where: { id: p_id },
            include: [
                {
                    association: 'user'
                }
            ]
        })

        if (existPost) {
            if (imageData) {
                imageData = await s3SharpImageUpload(imageData)
            }

            const addPostReply = await db.UserPostReply.create({ u_id: u_id, p_id: existPost.id, time: timeStamp, reply: reply, c_id: c_id, image: imageData })
            if (addPostReply) {
                if (u_id != existPost.u_id) {
                    await db.notification.create({
                        u_id: u_id,
                        post_id: p_id,
                        type: NotificationEnum.REPLY_COMMENT_Post,
                        f_id: existPost.u_id,
                        message: NotificationMessage.REPLY
                    })

                    let check_email_notification = await db.notificationSetting.findOne({
                        where: {
                            u_id: existPost.u_id
                        },
                        raw: true
                    })

                    if (check_email_notification?.email_notification == true) {
                        let user_that_comment_on_post = await db.User.findOne({ where: { id: u_id }, raw: true })
                        let email_of_owner_post = await db.User.findOne({ where: { id: existPost.u_id }, raw: true })

                        await notificationEmail(email_of_owner_post.email, user_that_comment_on_post.first_name, NotificationMessage.REPLY)
                    }

                    if (check_email_notification?.sms_notification == true) {
                        // let user_that_like_post = await db.User.findOne({ where: { id: u_id }, raw: true })
                        // let phone_of_owner_post = await db.User.findOne({ where: { id: existPost.u_id }, raw: true })
                        // let info = await smsNotification(phone_of_owner_post.phone, user_that_like_post.first_name, NotificationMessage.REPLY)
                        // console.log('sms send to reply post', info)
                    }

                    if (existPost?.user?.fcm_token) {
                        let message = {
                            token: existPost?.user?.fcm_token,
                            notification: {
                                title: `Comment Post`,
                                body: `${user?.first_name + ' ' + user?.last_name} comment on  your post`
                            },
                            data: { data: JSON.stringify(post) }
                        }
                        await sendNotification(message)
                    }
                }

                const user = await db.User.findOne({ id: u_id });

                const existComment = await db.UserPostComment.findOne({
                    where: { id: c_id },
                });

                const commentUser = await db.User.findOne({
                    where: { id: existComment.u_id }
                })

                await replyCommentEmail(commentUser, commentUser.email);

                const requestData = { p_id: p_id, page: page, order: order }
                const allcomments = await viewAllPostComments(req, requestData)

                return {
                    status: true,
                    message: 'Reply added successfully',
                    data: { comment: allcomments.data }
                }
            }
            return {
                status: false,
                message: 'Reply not added'
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

const deleteUserPostReply = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { id } = req.body
        const findUserReply = await db.UserPostReply.findOne({ where: { id: id } })
        if (findUserReply) {
            if (findUserReply?.image) {
                await deleteImage(findUserReply?.image)
            }

            const deleteUserPostReply = await db.UserPostReply.destroy({ where: { id: id } })
            await db.UserLikeComment.destroy({ where: { r_id: id } })
            if (deleteUserPostReply) {
                return {
                    data: true,
                    status: true,
                    message: 'Reply deleted successfully'
                }
            }
            return {
                status: false,
                message: 'Reply not deleted '
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

const updateUserPostReply = async (req) => {
    try {
        let { id, reply, p_id, page, order, imageData } = req.body
        const timeStamp = Date.now()
        const postReply = await db.UserPostReply.findOne({ where: { id: id } })
        if (postReply) {
            if (postReply?.image && imageData) {
                await deleteImage(postReply?.image)
            }

            if (imageData) {
                imageData = await s3SharpImageUpload(imageData)
            }

            const updatePostReply = await db.UserPostReply.update({ reply: reply, time: timeStamp, image: imageData ? imageData : postReply?.image }, { where: { id: id } })
            if (updatePostReply) {
                const UpdatedPostReply = await db.UserPostReply.findOne({ where: { id: id } })
                const requestData = { p_id: p_id, page: page, order: order }
                const allcomments = await viewAllPostComments(req, requestData)
                return {
                    status: true,
                    message: 'Reply updated successfully',
                    data: { comment: allcomments?.data?.allComments }
                }
            }
            return {
                status: false,
                message: 'Reply not updated'
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

const deletePostReply = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { r_id, p_id } = req.body

        const existPost = await db.Posts.findOne({ where: { id: p_id } })

        if (existPost) {
            const findUserReply = await db.UserPostReply.findOne({ where: { id: r_id } })
            if (findUserReply) {
                if (findUserReply?.u_id == u_id || existPost.u_id == u_id) {
                    if (findUserReply?.image) {
                        await deleteImage(findUserReply?.image)
                    }

                    const deleteUserPostReply = await db.UserPostReply.destroy({ where: { id: r_id } })
                    if (deleteUserPostReply) {
                        return {
                            status: true,
                            message: 'Reply deleted successfully'
                        }
                    }
                }
                return {
                    status: false,
                    message: 'you cannot delete this reply'
                }
            }
            return {
                status: false,
                message: 'You cant delete this reply'
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

export { deletePostReply, addUserPostReply, deleteUserPostReply, updateUserPostReply, viewAllPostComments }
