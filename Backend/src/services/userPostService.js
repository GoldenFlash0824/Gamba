import moment from 'moment'
import NotificationMessage from '../enums/notification-message.js'
import NotificationEnum from '../enums/notification-type-enum.js'
import db from '../models/index.js'
import { sendNotification } from '../notification/sendNotification.js'
import { getUserIdFromToken } from '../utilities/authentication.js'
import { deleteMultipleImage, s3ImageUpload } from './aws.js'
import { notificationEmail, postLikeEmail } from './emailService.js'
import { facetStage } from './userService.js'

const createPost = async (req) => {
    const { description, images, title, privacy, future_post_date } = req.body
    const u_id = await getUserIdFromToken(req)

    let user = await db.User.findOne({
        where: {
            id: u_id,
            [db.Op.or]: [{ disable: true }, { is_block: true }]

        }
    })

    if (user) {
        return {
            status: false,
            message: user?.is_block ? `You'r blocked by admin` : `Your account is disabled by admin`
        }
    }

    let productImage = []

    const imagess = typeof images == 'string' ? JSON.parse(images) : images

    if (imagess?.length) {
        for (let i = 0; i < imagess?.length; i++) {
            const startStr = imagess[i].toString().startsWith('data:image/')
            if (startStr) {
                productImage.push(await s3ImageUpload(imagess[i]))
            }
        }
    }

    let _createPoste = await db.Posts.create({ u_id: u_id, description: description, images: productImage, title: title, status: false, privacy: privacy, future_post_date: future_post_date })

    return {
        data: { createdPost: _createPoste },
        status: true,
        message: `User post created successfully`
    }
}

const updatePost = async (req) => {
    const { posteId } = req.params
    const { description, images, title, privacy, future_post_date } = req.body
    const u_id = await getUserIdFromToken(req)

    let user = await db.User.findOne({
        where: {
            id: u_id,
            [db.Op.or]: [{ disable: true }, { is_block: true }]

        }
    })

    if (user) {
        return {
            status: false,
            message: user?.is_block ? `You'r blocked by admin` : `Your account is disabled by admin`
        }
    }

    const post = await db.Posts.findOne({ where: { id: posteId, u_id: u_id } })
    const imagess = typeof images == 'string' ? JSON.parse(images) : images

    if (post) {
        let prevImageData = typeof post?.images == 'string' ? JSON.parse(post?.images) : post?.images
        //let prevImageData = ['1680173027255.png', 'ahad.png']
        //let images = ['ttt.png', 'new.png']
        // await deleteMultipleImage(prevImageData)

        if (prevImageData?.length && imagess?.length) {
            let removedImages = prevImageData?.filter((e) => !imagess?.includes(e))
            removedImages?.length ? await deleteMultipleImage(removedImages) : ''
        }
        let productImage = []
        if (imagess?.length) {
            for (let i = 0; i < imagess?.length; i++) {
                const startStr = imagess[i].toString().startsWith('data:image/')
                if (startStr) {
                    productImage.push(await s3ImageUpload(imagess[i]))
                } else {
                    productImage.push(imagess[i])
                }
            }
        }

        const update_post = await db.Posts.update(
            { description: description || post.description, images: productImage || post.images, title: title || post.title, privacy: privacy, future_post_date: future_post_date || post.future_post_date },
            {
                where: {
                    id: posteId,
                    u_id: u_id
                }
            }
        )
        return {
            data: { post: update_post },
            status: true,
            message: `Post updated successfully`
        }
    } else {
        return {
            status: false,
            message: `Post Not Found`
        }
    }
}

const deletePost = async (req) => {
    const { post_id } = req.params
    const u_id = await getUserIdFromToken(req)

    let user = await db.User.findOne({
        where: {
            id: u_id,
            [db.Op.or]: [{ disable: true }, { is_block: true }]

        }
    })

    if (user) {
        return {
            status: false,
            message: user?.is_block ? `You'r blocked by admin` : `Your account is disabled by admin`
        }
    }

    const post = await db.Posts.findOne({ where: { id: post_id, u_id: u_id } })
    if (post) {
        if (post?.images?.length) {
            let imageData = typeof post?.images == 'string' ? JSON.parse(post?.images) : post?.images
            await deleteMultipleImage(imageData)
        }

        const _deletedPost = await db.Posts.destroy({
            where: {
                id: post_id,
                u_id: u_id
            }
        })
        if (_deletedPost) {
            return {
                data: { postDeleted: true },
                status: true,
                message: `Post deleted successfully `
            }
        } else {
            return {
                status: false,
                message: `Failed to delete post`
            }
        }
    } else {
        return {
            status: false,
            message: `User Post Not Found `
        }
    }
}

const viewAllUserPosts = async (req) => {
    const u_id = await getUserIdFromToken(req)

    const { limit, offset } = await facetStage(req.query.page)
    const id = req.query.id
    let userPosts = await db.Posts.findAll({
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = userPosts.id)`), 'total_likes_count'],

                [db.sequelize.literal(`(SELECT COUNT(*) FROM userComments WHERE post_id = userPosts.id)`), 'total_comments_count']
            ]
        },
        include: [
            {
                association: 'user',
                attributes: ['id', 'first_name', 'last_name', 'image', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format']
            }
            // {
            //     association: 'postLikes'
            // },
            // {association: 'postComments'}
        ],
        where: { u_id: id || u_id },
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset
    })

    return {
        data: { viewAllPosts: userPosts },
        status: true,
        message: `View All User Posts`
    }
}

const viewAllPosts = async (req) => {
    const { limit, offset } = await facetStage(req.query.page)
    const u_id = await getUserIdFromToken(req)
    const currentDate = moment().format('MM/DD/YYYY')

    //let feture_post_date = null
    let post_data = await db.hidePost.findAll({
        where: {
            u_id: u_id
        }
    })
    let post_id = []
    post_id = post_data?.length ? post_data.map((e) => e.post_id) : []

    //disable user list

    let disable_user_data = await db.User.findAll({
        where: {
            disable: true
        }
    })
    let disable_user_id = []
    disable_user_id = disable_user_data?.length ? disable_user_data.map((n) => n.id) : []

    let all_post_disable_user = await db.Posts.findAll({
        where: {
            u_id: { [db.Op.in]: disable_user_id }
        },
        attributes: ['id', 'u_id']
    })
    all_post_disable_user = all_post_disable_user.map((post) => post.id)

    //let where = feture_post_date === null ? {status: false, id: {[db.Op.notIn]: post_id}, privacy: 'Public', feture_post_date: {[db.Op.eq]: currentDate}} : {status: false, id: {[db.Op.notIn]: post_id}, privacy: 'Public'}

    let concate_post_array = post_id.concat(all_post_disable_user)
    let allPosts = await db.Posts.findAll({
        where: {
            status: false,
            id: { [db.Op.notIn]: concate_post_array },
            // privacy: {[db.Op.or]: ['My Network', 'Public']},
            [db.Op.or]: [
                { privacy: 'Public' },
                db.sequelize.literal(`EXISTS(SELECT * FROM favoriteSellers WHERE favoriteSellers.seller_id = ${u_id}  AND userPosts.privacy='My Network' AND favoriteSellers.u_id = userPosts.u_id)`),
                db.sequelize.literal(`EXISTS(SELECT * FROM userPosts as posts WHERE userPosts.privacy='My Network' AND posts.id=userPosts.id AND posts.u_id = ${u_id})`)
                //  db.sequelize.literal(`EXISTS(SELECT * FROM userPosts WHERE  userPosts.u_id = ${u_id})`)
            ],

            future_post_date: { [db.Op.eq]: null }
        },
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = userPosts.id)`), 'total_likes_count'],

                [db.sequelize.literal(`(SELECT COUNT(*) FROM userPostComments WHERE p_id = userPosts.id)`), 'total_comments_count'],
                [db.sequelize.literal(`(SELECT COUNT(*) FROM shareModels WHERE post_id = userPosts.id)`), 'total_share_count'],
                [db.sequelize.literal(`EXISTS(SELECT * FROM userLikes WHERE post_id = userPosts.id AND u_id = ${u_id})`), 'isLiked']
            ]
        },
        include: [
            {
                model: db.UserPostComment,
                association: 'userComments',
                subQuery: false,
                include: [{ association: 'likeComment' }, { association: 'dislikeComment' }, { association: 'commentedUser', attributes: ['id', 'first_name', 'last_name', 'image', 'lat', 'log'] }],
                order: [['createdAt', 'DESC']],
                limit: 2
            },
            {
                association: 'user',

                attributes: ['id', 'first_name', 'last_name', 'image', 'lat', 'log', 'display_location', 'display_phone', 'display_email', 'display_dob', 'display_profile', 'display_dob_full_format', 'disable', 'is_block', [db.sequelize.col('address'), 'location']],
                where: {
                    disable: false
                }
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset
    })

    let allPostPosts = await db.Posts.findAll({
        where: {
            status: false,
            id: { [db.Op.notIn]: post_id },
            [db.Op.or]: [
                { privacy: 'Public' },
                db.sequelize.literal(`EXISTS(SELECT * FROM favoriteSellers WHERE favoriteSellers.seller_id = ${u_id} AND userPosts.privacy='My Network' AND favoriteSellers.u_id = userPosts.u_id)`),
                db.sequelize.literal(`EXISTS(SELECT * FROM userPosts as posts WHERE userPosts.privacy='My Network' AND posts.id=userPosts.id AND posts.u_id = ${u_id})`)
                //  db.sequelize.literal(`EXISTS(SELECT * FROM userPosts WHERE  userPosts.u_id = ${u_id})`)
            ],

            future_post_date: { [db.Op.lte]: currentDate }
        },
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = userPosts.id)`), 'total_likes_count'],
                [db.sequelize.literal(`(SELECT COUNT(*) FROM shareModels WHERE post_id = userPosts.id)`), 'total_share_count'],
                [db.sequelize.literal(`(SELECT COUNT(*) FROM userPostComments WHERE p_id = userPosts.id)`), 'total_comments_count'],
                [db.sequelize.literal(`EXISTS(SELECT * FROM userLikes WHERE post_id = userPosts.id AND u_id = ${u_id})`), 'isLiked']
            ]
        },
        include: [
            {
                model: db.UserPostComment,
                association: 'userComments',
                subQuery: false,
                include: [{ association: 'likeComment' }, { association: 'dislikeComment' }, { association: 'commentedUser', attributes: ['id', 'first_name', 'last_name', 'image', 'lat', 'log'] }],
                order: [['createdAt', 'DESC']],
                limit: 2
            },
            {
                association: 'user',

                attributes: ['id', 'first_name', 'last_name', 'image', 'lat', 'log', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'disable', [db.sequelize.col('address'), 'location']],
                where: {
                    disable: false
                }
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset
    })
    //let totalCommentCount = await db.PostComments.findAll({where:{}})

    let notification_count = await db.notification.count({
        where: {
            is_read: false,
            f_id: u_id
        }
    })

    const concatenatedArray = allPosts?.concat(allPostPosts)
    const post_limit_data = concatenatedArray.slice(0, limit)
    post_limit_data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    // console.log('post limit', post_limit_data)
    return {
        data: { viewAllPosts: post_limit_data, notification_count: notification_count },
        status: true,
        message: `View All Posts`
    }
}

const viewSingleUserPosts = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { limit, offset } = await facetStage(req.query.page)
    let allPosts = await db.Posts.findAll({
        where: {
            u_id: u_id,
            // status: false
        },
        order: [['createdAt', 'DESC']],
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = userPosts.id)`), 'total_likes_count'],

                [db.sequelize.literal(`(SELECT COUNT(*) FROM userPostComments WHERE p_id = userPosts.id)`), 'total_comments_count'],
                [db.sequelize.literal(`EXISTS(SELECT * FROM userLikes WHERE post_id = userPosts.id AND u_id = ${u_id})`), 'isLiked']
            ]
        },
        include: [
            {
                association: 'user',
                attributes: ['id', 'first_name', 'last_name', 'image', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format']
            },
            {
                association: 'postLikes'
            },
            { association: 'postComments' }
        ],

        limit: limit,
        offset: offset
    })

    return {
        data: { viewAllPosts: allPosts },
        status: true,
        message: `View All Posts`
    }
}

const addPostLike = async (req) => {
    const { post_id } = req.body
    const u_id = await getUserIdFromToken(req)
    let user = await db.User.findOne({ id: u_id })
    let getPost = await db.Posts.findOne({
        where: {
            id: post_id
        },

        include: [
            {
                association: 'user'
            }
        ]
    })

    if (getPost) {
        let alreadyLiked = await db.PostLikes.findOne({ where: { u_id: u_id, post_id: post_id } })
        if (alreadyLiked) {
            return {
                status: false,
                message: `Post already liked`
            }
        } else {
            let _createLike = await db.PostLikes.create({ u_id: u_id, post_id: post_id })

            let count = await db.sequelize.query(`SELECT count(*) FROM userLikes WHERE userLikes.post_id= ${post_id};`, { replacements: { post_id: `${post_id}` } })

            if (_createLike) {
                if (u_id != getPost.u_id) {
                    await db.notification.create({
                        u_id: u_id,
                        post_id: post_id,
                        type: NotificationEnum.LIKE_POST,
                        f_id: getPost.u_id,
                        message: NotificationMessage.LIKE
                    })

                    let check_email_notification = await db.notificationSetting.findOne({
                        where: {
                            u_id: getPost.u_id
                        },
                        raw: true
                    })

                    await postLikeEmail(getPost.user, getPost.user.email);

                    if (check_email_notification?.email_notification == true) {
                        let user_that_like_post = await db.User.findOne({ where: { id: u_id }, raw: true })
                        let email_of_owner_post = await db.User.findOne({ where: { id: getPost.u_id }, raw: true })

                        await notificationEmail(email_of_owner_post.email, user_that_like_post.first_name, NotificationMessage.LIKE)
                    }

                    if (check_email_notification?.sms_notification == true) {
                        // let user_that_like_post = await db.User.findOne({ where: { id: u_id }, raw: true })
                        // let phone_of_owner_post = await db.User.findOne({ where: { id: getPost.u_id }, raw: true })
                        // let info = await smsNotification(phone_of_owner_post.phone, user_that_like_post.first_name, NotificationMessage.LIKE)
                        // console.log('infoinfoinfo', info)
                    }

                    if (getPost?.user?.fcm_token) {
                        let message = {
                            token: getPost?.user?.fcm_token,
                            notification: {
                                title: `Like Post`,
                                body: `${user?.first_name + ' ' + user?.last_name} like your post`
                            },
                            data: { data: JSON.stringify(getPost) }
                        }
                        await sendNotification(message)
                    }
                }

                _createLike.dataValues['count'] = count?.length > 0 ? count[0]?.[0]?.['count(*)'] : 0
                return {
                    data: { likes: _createLike },
                    status: true,
                    message: `Post liked`
                }
            } else {
                return {
                    status: false,
                    message: `Failed to like`
                }
            }
        }
    } else {
        return {
            status: false,
            message: `Post Not Found`
        }
    }
}

const unLikePost = async (req) => {
    const { post_id } = req.body
    const u_id = await getUserIdFromToken(req)
    let getPost = await db.Posts.findOne({ u_id: u_id, post_id: post_id })
    if (getPost) {
        let alreadyLiked = await db.PostLikes.findOne({ where: { u_id: u_id, post_id: post_id } })
        if (alreadyLiked) {
            await db.PostLikes.destroy({ where: { u_id: u_id, post_id: post_id } })
            let count = await db.sequelize.query(`SELECT count(*) FROM userLikes WHERE userLikes.post_id= ${post_id};`, { replacements: { post_id: `${post_id}` } })
            return {
                data: { count: count?.length > 0 ? count[0]?.[0]?.['count(*)'] : 0 },
                status: true,
                message: `Post unLiked`
            }
        } else {
            return {
                status: false,
                message: `Failed to unLike`
            }
        }
    } else {
        return {
            status: false,
            message: `Post Not Found`
        }
    }
}

const getAllPostLikes = async (req) => {
    const { post_id } = req.body
    const u_id = await getUserIdFromToken(req)
    let getPost = await db.Posts.findOne({
        where: {
            id: post_id
        },

        include: [
            {
                association: 'user'
            }
        ]
    })

    if (getPost) {
        let allLikes = await db.PostLikes.findAll({ where: { post_id: post_id }, include: [{ association: 'like_user', attributes: ['id', 'first_name', 'last_name', 'image', 'email', 'chat_id', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format'] }] })

        if (allLikes) {
            return {
                data: allLikes,
                status: true,
                message: `Post all likes`
            }
        } else {
            return {
                status: false,
                message: `Failed to get all likes`
            }
        }
    } else {
        return {
            status: false,
            message: `Post Not Found`
        }
    }
}

const addPostComment = async (req) => {
    const { post_id, comment } = req.body
    const u_id = await getUserIdFromToken(req)
    let getPost = await db.Posts.findOne({ u_id: u_id, post_id: post_id })
    if (getPost) {
        let _createComment = await db.PostComments.create({ u_id: u_id, post_id: post_id, comment: comment })

        if (_createComment) {
            return {
                data: { commentCreated: _createComment },
                status: true,
                message: `Comment added successfully`
            }
        } else {
            return {
                status: false,
                message: `Failed to add comment`
            }
        }
    } else {
        return {
            status: false,
            message: `Post Not Found`
        }
    }
}

const searchPosts = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { limit, offset } = await facetStage(req.query.page)
    const filter = req.query.filter
    console.log('gilterdata', filter)

    //remove hide post from search

    let post_data = await db.hidePost.findAll({
        where: {
            u_id: u_id
        }
    })
    let post_id_data = []
    post_id_data = post_data?.length ? post_data.map((d) => d.post_id) : []

    const userIds = await db.User.findAll({
        attributes: ['id'],
        where: {
            [db.Op.or]: [
                db.sequelize.literal(`CONCAT(first_name ,' ', last_name) LIKE '%${filter}%'`),
                db.sequelize.literal(`CONCAT(first_name,'',last_name) LIKE '%${filter}%'`),
                { first_name: { [db.Op.like]: `%${filter}%` } },
                { last_name: { [db.Op.like]: `%${filter}%` } },

            ],
        },
    });
    const userIdsArray = userIds.map(category => category.id);
    let allPosts = await db.Posts.findAll({
        where: {
            status: false,
            [db.Op.or]: [{ description: { [db.Op.like]: '%' + filter + '%' } }, { title: { [db.Op.like]: '%' + filter + '%' } }, {
                u_id: {
                    [db.Op.in]: userIdsArray,
                },
            }],
            [db.Op.and]: [
                { id: { [db.Op.notIn]: post_id_data } },
                {
                    [db.Op.or]: [{ privacy: 'Public' }, db.sequelize.literal(`EXISTS(SELECT * FROM favoriteSellers WHERE favoriteSellers.seller_id = ${u_id} AND userPosts.privacy='My Network' AND favoriteSellers.u_id = userPosts.u_id )`), db.sequelize.literal(`EXISTS(SELECT * FROM userPosts as posts WHERE userPosts.privacy='My Network' AND posts.id=userPosts.id AND posts.u_id = ${u_id})`)]
                }
            ]
        },
        // where: {
        //     description: {[db.Op.like]: '%' + filter + '%'}
        // },
        include: [
            {
                association: 'user',
                attributes: ['id', 'first_name', 'last_name', 'image', 'lat', 'log', 'address', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'disable'],
                where: {
                    disable: false
                }
            }
        ],
        order: [['createdAt', 'DESC']],

        limit: limit,
        offset: offset
    })

    return {
        data: { searchPosts: allPosts },
        status: true,
        message: `View All Posts`
    }
}

const popularPost = async (req) => {
    const u_id = await getUserIdFromToken(req)
    let post_data = await db.hidePost.findAll({
        where: {
            u_id: u_id
        }
    })
    let post_id = []
    post_id = post_data?.length ? post_data.map((e) => e.post_id) : []

    let userPosts = await db.Posts.findAll({
        where: {
            status: false,
            [db.Op.or]: [{ privacy: 'Public' }, db.sequelize.literal(`EXISTS(SELECT * FROM favoriteSellers WHERE favoriteSellers.seller_id = ${u_id} AND userPosts.privacy='My Network' AND favoriteSellers.u_id = userPosts.u_id)`), db.sequelize.literal(`EXISTS(SELECT * FROM userPosts as posts WHERE userPosts.privacy='My Network' AND posts.id=userPosts.id AND posts.u_id = ${u_id})`)],
            id: { [db.Op.notIn]: [...post_id, u_id] }
        },
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = userPosts.id)`), 'total_likes_count'],

                [db.sequelize.literal(`(SELECT COUNT(*) FROM userComments WHERE post_id = userPosts.id)`), 'total_comments_count']
            ],

            exclude: ['description', 'updatedAt']
        },
        include: [
            {
                association: 'user',
                required: false,
                attributes: ['id', 'first_name', 'last_name', 'image', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'disable', 'is_block'],
                where: {
                    disable: false,
                    is_block: false
                }
            }
        ],
        order: [['createdAt', 'DESC'], [db.sequelize.literal('total_likes_count'), 'DESC'],]
    })

    const topPosts = userPosts.slice(0, 10)
    return {
        data: topPosts,
        status: true,
        message: `View All User Posts`
    }
}
const viewPostById = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { post_id } = req.body
    const { limit, offset } = await facetStage(req.query.page)
    let allPosts = await db.Posts.findOne({
        where: {
            status: false,
            id: post_id
        },
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = userPosts.id)`), 'total_likes_count'],

                [db.sequelize.literal(`(SELECT COUNT(*) FROM userPostComments WHERE p_id = userPosts.id)`), 'total_comments_count'],
                [db.sequelize.literal(`EXISTS(SELECT * FROM userLikes WHERE post_id = userPosts.id AND u_id = ${u_id})`), 'isLiked']
                // [db.sequelize.literal(`(SELECT * FROM userPostComments WHERE p_id = userPosts.id)`), 'total_comments_count']
            ]
        },
        include: [
            {
                association: 'user',
                attributes: ['id', 'first_name', 'last_name', 'image', 'lat', 'log', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', [db.sequelize.col('address'), 'location']]
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset
    })
    //let totalCommentCount = await db.PostComments.findAll({where:{}})

    return {
        data: { viewAllPosts: allPosts },
        status: true,
        message: `Single User Post`
    }
}

const hidePost = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { post_id } = req.body
    try {
        let hidePostData = await db.hidePost.create({
            post_id: post_id,
            u_id: u_id
        })
        return {
            data: hidePostData,
            status: true,
            message: `Post is hide `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}
//sidedata
const sideBarCount = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)

        let mypost = await db.Posts.count({
            where: {
                u_id: u_id
            }
        })

        let myevent = await db.Events.count({
            where: {
                u_id: u_id
            }
        })

        let myproduct = await db.UserProducts.count({
            where: {
                u_id: u_id
            }
        })

        let myorders = await db.Checkout.count({
            where: {
                u_id: u_id
            }
        })

        let seller_data = await db.hideSeller.findAll({
            where: {
                u_id: u_id
            }
        })

        let sellerIds = await db.favoriteSeller.findAll({
            attributes: ['seller_id', 'u_id'],
            where: {
                u_id: u_id
            },
            raw: true
        })

        let soldProducts = await db.Orders.count({
            where: {
                seller_id: u_id
            },
            group: ['product_id']
        })

        sellerIds = sellerIds?.length ? sellerIds.map((e) => e.seller_id) : []

        let seller_id_data = []
        seller_id_data = seller_data?.length ? seller_data.map((d) => d.seller_id) : []

        let myfevSeller = await db.User.count({
            where: {
                [db.Op.and]: [{ id: { [db.Op.in]: sellerIds } }, { id: { [db.Op.notIn]: seller_id_data } }],
                is_block: false,
                disable: false
            },
        })

        return {
            data: { mypost, myevent, myproduct, myorders, myfevSeller, soldProducts: soldProducts.length },
            status: true,
            message: `side bar count `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const getSellerAllPost = async (req) => {
    const { u_id } = req.body
    const { limit, offset } = await facetStage(req.query.page)
    const login_user_id = await getUserIdFromToken(req)
    const currentDate = moment().format('MM/DD/YYYY')

    //let feture_post_date = null
    let post_data = await db.hidePost.findAll({
        where: {
            u_id: login_user_id
        }
    })
    let post_id = []
    post_id = post_data?.length ? post_data.map((e) => e.post_id) : []

    //disable user list

    let disable_user_data = await db.User.findAll({
        where: {
            disable: true
        }
    })
    let disable_user_id = []
    disable_user_id = disable_user_data?.length ? disable_user_data.map((n) => n.id) : []

    let all_post_disable_user = await db.Posts.findAll({
        where: {
            u_id: { [db.Op.in]: disable_user_id }
        },
        attributes: ['id', 'u_id']
    })
    all_post_disable_user = all_post_disable_user.map((post) => post.id)

    let concate_post_array = post_id.concat(all_post_disable_user)

    let allPosts = await db.Posts.findAll({
        where: {
            u_id: u_id,
            id: { [db.Op.notIn]: concate_post_array },
            status: false,
            [db.Op.or]: [
                { privacy: 'Public' },
                db.sequelize.literal(`EXISTS(SELECT * FROM favoriteSellers WHERE favoriteSellers.seller_id = ${login_user_id} AND userPosts.privacy='My Network' AND favoriteSellers.u_id = userPosts.u_id )`),
                db.sequelize.literal(`EXISTS(SELECT * FROM userPosts as posts WHERE userPosts.privacy='My Network' AND posts.id=userPosts.id AND posts.u_id = ${login_user_id})`)
                //  db.sequelize.literal(`EXISTS(SELECT * FROM userPosts WHERE  userPosts.u_id = ${u_id})`)
            ]
        },

        order: [['createdAt', 'DESC']],
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = userPosts.id)`), 'total_likes_count'],

                [db.sequelize.literal(`(SELECT COUNT(*) FROM userPostComments WHERE p_id = userPosts.id)`), 'total_comments_count'],
                [db.sequelize.literal(`EXISTS(SELECT * FROM userLikes WHERE post_id = userPosts.id AND u_id = ${u_id})`), 'isLiked']
                // [db.sequelize.literal(`(SELECT * FROM userPostComments WHERE p_id = userPosts.id)`), 'total_comments_count']
            ]
        },
        include: [
            {
                association: 'user',
                attributes: ['id', 'first_name', 'last_name', 'image', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format']
            },
            {
                association: 'postLikes'
            },
            { association: 'postComments' }
        ],

        limit: limit,
        offset: offset
    })

    return {
        data: allPosts,
        status: true,
        message: `View All Posts`
    }
}

export { createPost, updatePost, deletePost, viewAllUserPosts, viewAllPosts, addPostLike, addPostComment, viewSingleUserPosts, searchPosts, popularPost, unLikePost, viewPostById, hidePost, getAllPostLikes, sideBarCount, getSellerAllPost }
