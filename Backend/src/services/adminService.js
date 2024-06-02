import db from '../models/index.js'
import { generateAccessToken } from '../utilities/authentication.js'
import { deleteImage, s3SharpImageUpload, userProfileImage, deleteMultipleImage, s3ImageUpload } from './aws.js'
import { comparePassword, hashPassword } from '../utilities/passwordUtils.js'
import { updatePassword } from './userService.js'
import { facetStage } from './userService.js'
import { getUserIdFromToken } from '../utilities/authentication.js'
import moment from 'moment'
import { adminPasswordUpdated, adminResetPasswordEmail } from './emailService.js'
import crypto from 'crypto'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.SECRET_KEY, { apiVersion: '2023-08-16' })

const adminLogin = async (req) => {
    try {
        const { email, password } = req.body
        const adminEmail = email.toLowerCase()
        const adminData = await db.Admin.findOne({ where: { email: adminEmail } })
        if (adminData) {
            const checkPassword = await comparePassword(password, adminData?.password)
            if (adminData && checkPassword) {
                const auth_token = await generateAccessToken(adminData, true)
                return {
                    status: true,
                    message: 'Admin logged in successfully',
                    data: { admin: adminData, token: "Bearer " + auth_token }
                }
            }
            return {
                status: false,
                message: 'Wrong email or password'
            }
        }
        return {
            status: false,
            message: 'Email not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const resetPassword = async (req) => {
    try {
        const { email } = req.body;

        // Generate a unique reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpires = Date.now() + 3600000; // 1 hour

        // Find the user by email and update the reset token and expiration time
        const user = await db.Admin.findOne({ where: { email } });
        if (!user) {
            return {
                status: false,
                message: 'Admin email not found'
            }
        }

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();
        await adminResetPasswordEmail(user)

        return {
            status: true,
            message: 'Email sent to your email address successful'
        }

    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const updateAdminPassword = async (req) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Find the user by reset token and check expiration time
        const user = await db.Admin.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [db.Op.gt]: Date.now() },
            },
        });

        if (!user) {
            return {
                status: false,
                message: 'Password reset token is invalid or has expired'
            }
        }
        const bcryptPassword = await hashPassword(newPassword)

        // Update the password and clear the reset token and expiration
        user.password = bcryptPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();
        return {
            status: true,
            message: 'Password successfully reset'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const stripeTransferDetails = async (req) => {
    try {
        const results = await db.pendingTransfers.findAll({
            include: [
                {
                    model: db.User,
                    as: 'pendingTransferUser'
                },
                {
                    model: db.User,
                    as: 'pendingTransfersPurchasedBy'
                },
                {
                    model: db.Checkout,
                    as: 'pendingTransfesOrder'
                }
            ]
        });
        const processedResults = results.map(result => {

            const paymentInfo = {
                userId: result.pendingTransferUser.id,
                name: result.pendingTransferUser.first_name + ' ' + result.pendingTransferUser.last_name,
                amount: result.amount / 100,
                processingDate: moment(result.dateDeposite).format('MM-DD-YYYY HH:mm'),
                orderDate: moment(result.createdAt).format('MM-DD-YYYY HH:mm'),
                orderedById: result.pendingTransfersPurchasedBy.id,
                orderedByName: result.pendingTransfersPurchasedBy.first_name + ' ' + result.pendingTransfersPurchasedBy.last_name,
                orderId: result.pendingTransfesOrder.id,
                status: result.status,
                remarks: result.remarks
            };

            return paymentInfo;
        });

        return {
            status: true,
            data: processedResults
        }

    } catch (error) {
        console.error('Error occured while processing payment', error);
    }
}


const getAdminProfile = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const adminData = await db.Admin.findOne({ where: { id: u_id } })
        if (adminData) {
            return {
                status: true,
                message: 'Admin profile',
                data: { admin: adminData }
            }
        }
        return {
            status: false,
            message: 'Not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const updateAdminProfile = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { email, password } = req.body
        const adminData = await db.Admin.findOne({ where: { id: u_id } })
        if (adminData) {
            const bcryptPassword = await hashPassword(password)
            if (password) {
                await db.Admin.update({ password: bcryptPassword }, { where: { id: u_id } })
                console.log('======adminData', adminData)
                //  await adminPasswordUpdated(adminData, password)
            }
            return {
                status: true,
                message: 'Admin profile profile',
                data: { admin: adminData }
            }
        }
        return {
            status: false,
            message: 'Not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const viewStats = async (req) => {
    try {
        const users = await db.User.count()
        const events = await db.Events.count()
        const post = await db.Posts.count()
        const product = await db.UserProducts.count()
        const reported_product = await db.reportedProduct.count()
        const reported_post = await db.reportedPost.count()
        const reported_event_data = await db.reportedEvent.count()
        const category_count = await db.Categories.count()
        const chemical_count = await db.Chemicals.count()
        return {
            status: true,
            message: 'Dashboard stats',
            data: { all_user: users, events: events, post: post, product: product, reported_product: reported_product, reported_post: reported_post, reported_event_data: reported_event_data, category_count: category_count, chemical_count: chemical_count }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const userProfileUpdated = async (req) => {
    try {
        const { profile } = req.body
        if (profile) {
            if (profile.startsWith('data:image')) {
                await userProfileImage(profile)
            }
            return {
                status: true,
                message: 'User profile updated'
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

const updateUser = async (req) => {
    try {
        const { first_name, email, phone, password, gender, dob, address, last_name, about, image } = req.body

        let user = await db.User.findOne({ where: { email: email } })
        const bcryptPassword = await hashPassword(password)

        let newImage = ''
        if (user?.image !== image) {
            if (image) {
                let prevImage = user.image
                await deleteImage(prevImage)
                newImage = await s3SharpImageUpload(image)
            }

            await db.User.update(
                {
                    phone: phone,
                    first_name: first_name,
                    gender: gender,
                    dob: dob && dob != 'Invalid date' ? dob : user?.dob !== 'Invalid date' ? user?.dob : null,
                    address: address,
                    last_name: last_name,
                    about: about,
                    image: newImage ? newImage : user?.image,
                },
                {
                    where: {
                        email: email
                    }
                }
            )
        } else {
            await db.User.update(
                {
                    phone: phone,
                    first_name: first_name,
                    gender: gender,
                    dob: dob && dob != 'Invalid date' ? dob : user?.dob !== 'Invalid date' ? user?.dob : null,
                    address: address,
                    last_name: last_name,
                    about: about,
                    image: image == null ? null : user?.image
                },
                {
                    where: {
                        email: email
                    }
                }
            )
        }
        if (password != user.password) {
            await db.User.update(
                {
                    password: bcryptPassword
                },
                {
                    where: {
                        email: email
                    }
                }
            )
            await adminPasswordUpdated(user, password)
        }

        return {
            status: true,
            message: 'User is Updated'
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}
// View All Tastes
const viewAllUserTaste = async (req) => {
    try {
        const { u_id } = req.query
        const user = await db.User.findOne({ where: { id: u_id } })
        if (user) {
            const allTastes = await db.UserTaste.findAll({ where: { u_id: u_id } })
            if (allTastes) {
                let tasteNameArray = []
                for (let i = 0; i < allTastes.length; i++) {
                    const tasteName = await db.Taste.findOne({ where: { id: allTastes[i].t_id } })
                    tasteNameArray.push({ t_id: tasteName.id, name: tasteName.name, icon: tasteName.icon })
                }
                return {
                    status: true,
                    message: 'Tastes',
                    data: { tastes: tasteNameArray }
                }
            }
            return {
                status: false,
                message: 'No Tastes found'
            }
        }
        return {
            status: false,
            message: 'No user found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

//All users for excel sheet
const exportAllUsers = async (req) => {
    try {
        // const users = await db.User.findAll({where: {phone: {[db.Op.not]: ''}}})
        const usersData = await db.sequelize.query(`Select first_name, last_name, phone From users Where phone !='';`, { type: db.QueryTypes.SELECT })
        return {
            status: true,
            message: `All users`,
            data: { all_users: usersData }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const blockReportedUser = async (req) => {
    try {
        const { f_id } = req.body
        let user = await db.User.findOne({ where: { id: f_id } })
        if (user) {
            if (user.blocked) {
                return {
                    status: false,
                    message: 'User already blocked'
                }
            }
            await db.User.update({ blocked: true }, { where: { id: f_id } })
            user = await db.User.findOne({ where: { id: f_id } })
            user.auth_token = ''
            user.login_token = ''
            user.password = ''
            return {
                status: true,
                message: 'User blocked successfully',
                data: user
            }
        }
        return {
            status: false,
            message: 'User not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const unBlockUser = async (req) => {
    try {
        const { f_id } = req.body
        let user = await db.User.findOne({ where: { id: f_id } })
        if (user) {
            await db.User.update({ blocked: false }, { where: { id: f_id } })
            user = await db.User.findOne({ where: { id: f_id } })
            user.auth_token = ''
            user.login_token = ''
            user.password = ''
            return {
                status: true,
                message: 'User unblocked successfully',
                data: user
            }
        }
        return {
            status: false,
            message: 'User not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const userSearch = async (req) => {
    try {
        const { search } = req.body

        const searchTerms = search.split(' ');
        let searchUsers = await db.User.findAll({
            where: {
                [db.Op.or]: [
                    {
                        [db.Op.and]: searchTerms.map((term) => ({
                            [db.Op.or]: [
                                {
                                    first_name: {
                                        [db.Op.like]: `%${term}%`,
                                    },
                                },
                                {
                                    last_name: {
                                        [db.Op.like]: `%${term}%`,
                                    },
                                },
                            ],
                        })),
                    },
                    {
                        email: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        phone: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        first_name: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        last_name: {
                            [db.Op.like]: `%${search}%`
                        }
                    }
                ],
                is_block: false
            },
            order: [['createdAt', 'ASC']],
        })
        return {
            status: true,
            message: 'product  search data',
            data: { users: searchUsers, query: search }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteUser = async (req) => {
    try {
        const { id } = req.params

        let checkUser = await db.User.findOne({
            where: {
                id: id
            }
        })
        if (checkUser) {
            // u_id=1..product_id= 100..handled
            await db.reportedEvent.destroy({ where: { u_id: id } })
            await db.reportedPost.destroy({ where: { u_id: id } })
            await db.reportedProduct.destroy({ where: { u_id: id } })

            //u_id=2, product_id=100..not handled

            //delete all the record from reported product that have product of deleted user
            let products = await db.UserProducts.findAll({ where: { u_id: id } })
            const productIds = products.map((product) => product.id)
            await db.reportedProduct.destroy({ where: { product_id: productIds } })
            //same for event of that user

            let events = await db.Events.findAll({ where: { u_id: id } })
            const eventsId = events.map((event) => event.id)
            await db.reportedEvent.destroy({ where: { event_id: eventsId } })

            //same for reported post

            let post = await db.Posts.findAll({ where: { u_id: id } })
            const postId = post.map((post) => post.id)
            await db.reportedPost.destroy({ where: { post_id: postId } })

            await db.Events.destroy({ where: { u_id: id } })
            await db.Posts.destroy({ where: { u_id: id } })
            await db.UserProducts.destroy({ where: { u_id: id } })

            await db.PostComments.destroy({ where: { u_id: id } })
            await db.PostLikes.destroy({ where: { u_id: id } })
            await db.User.destroy({
                where: {
                    id: id
                }
            })

            return {
                status: true,
                message: 'User is deleted is deleted'
            }
        } else {
            return {
                status: false,
                message: 'User  is not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const reportedProduct = async (req) => {
    try {
        const { product_id, reason } = req.body
        const u_id = await getUserIdFromToken(req)
        let checkproduct = await db.UserProducts.findOne({ where: { id: product_id } })
        let allready_reported = await db.reportedProduct.findOne({ where: { u_id: u_id, product_id: product_id } })
        if (allready_reported) {
            return {
                status: false,
                message: 'Producr is allready reported'
            }
        }
        if (checkproduct) {
            let reported = await db.reportedProduct.create({
                u_id: u_id,
                product_id: product_id,
                reason: reason
            })
            return {
                status: true,
                message: 'Product is reported',
                data: reported
            }
        } else {
            return {
                status: false,
                message: 'Product does not exist or product is already reported'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getAllProductGood = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)

        let allProducts = await db.UserProducts.findAndCountAll({
            order: [['createdAt', 'DESC']],
            attributes: {
                include: [
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM favorites WHERE product_id = userProductGood.id)`), 'num_favorites'],
                    [db.sequelize.literal('(SELECT SUM(quantity) FROM soldProducts where userProductGood.id= soldProducts.product_id )'), 'total_sold'],
                    [db.sequelize.literal('(SELECT SUM(total) FROM soldProducts where userProductGood.id= soldProducts.product_id )'), 'sold$']
                ]

            },
            include: [
                {
                    association: 'trade'
                },
                {
                    association: 'category'
                },
                {
                    association: 'chemicall'
                },
                {
                    association: 'fev-product'
                },
                {
                    association: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'address', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
                },
                {
                    association: 'chemical_data',

                    include: [
                        {
                            association: 'chemical_data_detail'
                        }
                    ]
                }
            ],
            offset: offset,
            limit: limit
        })

        const reported_product_count = await db.reportedProduct.count({
            include: [
                {
                    model: db.UserProducts,
                    as: 'reported_product',
                    where: {
                        is_block: false
                    }
                }
            ],
            where: {
                '$reported_product.is_block$': false
            }
        })
        const block_product_count = await db.reportedProduct.count({
            include: [
                {
                    model: db.UserProducts,
                    as: 'reported_product',
                    where: {
                        is_block: true
                    }
                }
            ],
            where: {
                '$reported_product.is_block$': true
            }
        })

        const remainingCount = allProducts?.count - (offset + allProducts?.rows.length)
        const total = await db.UserProducts.count({})
        return {
            status: true,
            message: 'All products',
            data: { products: allProducts.rows, count: allProducts.count, remaining: remainingCount, page: req.query.page, total: total, reported_product_count, block_product_count }
        }

    } catch (error) {
        return {
            status: false,
            message: error?.message
        }
    }
}

const searchProductGood = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        const { query } = req.query
        let allProducts = await db.UserProducts.findAndCountAll({
            order: [['createdAt', 'DESC']],
            attributes: {
                include: [
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM favorites WHERE product_id = userProductGood.id)`), 'num_favorites'],
                    [db.sequelize.literal('(SELECT SUM(quantity) FROM soldProducts where userProductGood.id= soldProducts.product_id )'), 'total_sold'],
                    [db.sequelize.literal('(SELECT SUM(total) FROM soldProducts where userProductGood.id= soldProducts.product_id )'), 'sold$']
                ]
            },

            include: [
                {
                    association: 'trade'
                },
                {
                    association: 'category'
                },
                {
                    association: 'chemicall'
                },
                {
                    association: 'fev-product'
                },
                {
                    association: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
                },
                {
                    association: 'chemical_data',

                    include: [
                        {
                            association: 'chemical_data_detail'
                        }
                    ]
                }
            ],
            where: {
                [db.Op.or]: [{
                    name: {
                        [db.Op.like]: `%${query}%`
                    }
                }, {
                    caption: {
                        [db.Op.like]: `%${query}%`
                    },
                }]
            },

            offset: offset,
            limit: limit
        })
        const remainingCount = allProducts?.count - (offset + allProducts?.rows.length)
        const total = await db.UserProducts.count({})
        return {
            status: true,
            message: 'All products',
            data: { products: allProducts.rows, count: allProducts.count, remaining: remainingCount, page: req.query.page, total: total }
        }
    } catch (error) {
        return {
            status: false,
            message: error?.message
        }
    }
}

const viewAllPosts = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)

        let allPosts = await db.Posts.findAndCountAll({
            attributes: {
                include: [
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = userPosts.id)`), 'total_likes_count'],

                    [db.sequelize.literal(`(SELECT COUNT(*) FROM userPostComments WHERE p_id = userPosts.id)`), 'total_comments_count'],
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM shareModels WHERE post_id = userPosts.id)`), 'total_share_count'],
                ]
            },
            include: [
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

        const reported_Post_count = await db.reportedPost.count({
            include: [
                {
                    model: db.Posts,
                    as: 'reported_post',
                    where: {
                        status: false
                    }
                }
            ],
            where: {
                '$reported_post.status$': false
            }
        })
        const block_Post_count = await db.Posts.count({
            where: {
                status: true
            }
        })

        const remainingCount = allPosts?.count - (offset + allPosts?.rows.length)
        const total = await db.Posts.count({})

        return {
            data: { posts: allPosts.rows, count: allPosts.count, remaining: remainingCount, page: req.query.page, total: total, reported_Post_count, block_Post_count },
            status: true,
            message: `View All Posts`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }

}

const searchPosts = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        const { filter } = req.query
        let allPosts = await db.Posts.findAndCountAll({
            attributes: {
                include: [
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = userPosts.id)`), 'total_likes_count'],
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM userPostComments WHERE p_id = userPosts.id)`), 'total_comments_count'],
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM shareModels WHERE post_id = userPosts.id)`), 'total_share_count'],
                ]
            },
            include: [
                {
                    association: 'user',

                    attributes: ['id', 'first_name', 'last_name', 'image', 'lat', 'log', 'display_location', 'display_phone', 'display_email', 'display_dob', 'display_profile', 'display_dob_full_format', 'disable', 'is_block', [db.sequelize.col('address'), 'location']],
                    where: {
                        disable: false
                    }
                }
            ],
            where: { [db.Op.or]: [{ description: { [db.Op.like]: '%' + filter + '%' } }, { title: { [db.Op.like]: '%' + filter + '%' } }] },
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset
        })

        const remainingCount = allPosts?.count - (offset + allPosts?.rows.length)
        const total = await db.Posts.count({})

        return {
            data: { posts: allPosts.rows, count: allPosts.count, remaining: remainingCount, page: req.query.page, total: total },
            status: true,
            message: `View All Posts`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }

}


//ahad2
const getreportedProduct = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        let reportedProduct = await db.reportedProduct.findAndCountAll({
            limit: limit,
            offset: offset,
            include: [
                {
                    model: db.UserProducts,
                    as: 'reported_product',
                    where: {
                        is_block: false
                    },
                    attributes: {
                        include: [
                            [db.sequelize.literal('(SELECT SUM(quantity) FROM soldProducts where reported_product.id= soldProducts.product_id )'), 'total_sold'],
                            [db.sequelize.literal('(SELECT SUM(total) FROM soldProducts where reported_product.id= soldProducts.product_id )'), 'sold$']
                        ]
                    },
                    include: [
                        {
                            association: 'trade'
                        },
                        {
                            association: 'category'
                        },
                        {
                            association: 'chemicall'
                        },
                        {
                            association: 'fev-product'
                        },
                        {
                            association: 'chemical_data',

                            include: [
                                {
                                    association: 'chemical_data_detail'
                                }
                            ]
                        },

                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'user_that_report_product',
                    attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        const reported_product_count = await db.reportedProduct.count({
            include: [
                {
                    model: db.UserProducts,
                    as: 'reported_product',
                    where: {
                        is_block: false
                    }
                }
            ],
            where: {
                '$reported_product.is_block$': false
            }
        })
        const block_product_count = await db.reportedProduct.count({
            include: [
                {
                    model: db.UserProducts,
                    as: 'reported_product',
                    where: {
                        is_block: true
                    }
                }
            ],
            where: {
                '$reported_product.is_block$': true
            }
        })
        const remainingCount = reportedProduct?.count - (offset + reportedProduct?.rows.length)
        return {
            status: true,
            message: 'product reported data',
            data: { reportedProduct: reportedProduct.rows, count: reportedProduct.count, remaining: remainingCount, page: req.query.page, reported_product_count, block_product_count }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getreportedProductSearch = async (req) => {
    try {
        const { search } = req.body
        let reportedProduct = await db.reportedProduct.findAll({
            include: [

                {
                    model: db.UserProducts,
                    as: 'reported_product',
                    // attributes: ['name', 'u_id', 'quantity', 'images'],
                    include: [
                        {
                            association: 'trade'
                        },
                        {
                            association: 'category'
                        },
                        {
                            association: 'chemicall'
                        },
                        {
                            association: 'fev-product'
                        },
                        {
                            association: 'chemical_data',

                            include: [
                                {
                                    association: 'chemical_data_detail'
                                }
                            ]
                        },
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id', 'first_name', 'last_name']
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'user_that_report_product',
                    attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
                }
            ],
            where: {
                [db.Op.or]: [
                    {
                        '$reported_product.name$': {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                ],
                '$reported_product.is_block$': false
            }
        })
        return {
            status: true,
            message: 'product  search data',
            data: reportedProduct
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getBlockproductSearch = async (req) => {
    try {
        const { search } = req.body
        let reportedProduct = await db.reportedProduct.findAll({
            include: [
                {
                    model: db.UserProducts,
                    as: 'reported_product',
                    // attributes: ['name', 'u_id', 'quantity', 'images'],
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id', 'first_name', 'last_name']
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'user_that_report_product',
                    attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
                }
            ],
            where: {
                [db.Op.or]: [
                    {
                        '$reported_product.name$': {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$reported_product.user.first_name$': {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$reported_product.price$': {
                            [db.Op.like]: `%${search}%`
                        }
                    }
                ],
                '$reported_product.is_block$': true
            }
        })
        return {
            status: true,
            message: 'product  search data',
            data: reportedProduct
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteReportedProduct = async (req) => {
    try {
        const { id } = req.params
        const { product_id } = req.params
        let checkProduct = await db.reportedProduct.findOne({
            where: {
                id: id
            }
        })
        if (checkProduct) {
            await db.reportedProduct.destroy({
                where: {
                    id: id
                }
            })
            await db.UserProducts.destroy({
                where: {
                    id: product_id
                }
            })
            await db.reportedProduct.destroy({
                where: {
                    product_id: product_id
                }
            })

            return {
                status: true,
                message: 'reported product is deleted'
            }
        } else {
            return {
                status: false,
                message: 'product is not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteProduct = async (req) => {
    try {
        let { id } = req.params
        if (id) {
            let _delete_product = await db.UserProducts.findOne({
                where: { id: id }
            })

            if (_delete_product) {
                await db.UserProducts.destroy({
                    where: { id: id }
                })
                return {
                    status: true,
                    message: 'Product deleted successful'
                }
            }

            return {
                status: false,
                message: 'Product not found'
            }
        }
        return {
            status: false,
            message: 'Product id not found'
        }

    } catch (error) {
        return {
            status: false,
            message: error
        }
    }

}


const updateReportedProduct = async (req) => {
    try {
        // const { product_id, product_name, quantity, price } = req.body
        const { product_id, product_name, price, is_donation, is_trade, images, quantity, trade_with, discount, category_id, chemical_id, is_organic, unit, available_from, available_to, allow_to_0rder, is_delivery, is_pickUp, advance_order_day, advance_order_in_weeks, distance, caption, allow_to_0rder_advance, none, allow_per_person, isUnlimitted } = req.body
        let formattedDate_available_to = moment(available_to).format('MM/DD/YY')
        const _available_from = moment(available_from).format('MM/DD/YY')

        const imagess = typeof images == 'string' ? JSON.parse(images) : images
        const trade_withh = typeof trade_with == 'string' ? JSON.parse(trade_with) : trade_with

        const product = await db.UserProducts.findOne({
            where: { id: product_id }
        })

        if (product) {
            let prevImageData = typeof product?.images == 'string' ? JSON.parse(product?.images) : product?.images
            let removedImages = prevImageData?.filter((e) => !imagess?.includes(e))
            removedImages?.length ? await deleteMultipleImage(removedImages) : ''

            let productImage = []

            if (imagess?.length) {
                for (let i = 0; i < imagess?.length; i++) {
                    const startStr = imagess[i].toString().startsWith('data:image/')
                    if (startStr) {
                        const uploadedImage = await s3ImageUpload(imagess[i])
                        productImage.push(uploadedImage)
                    } else {
                        productImage.push(imagess[i])
                    }
                }
            }
            let _check = await db.UserProducts.findOne({ where: { id: product_id } })
            await db.userTrades.destroy({ where: { product_id: _check.id } })
            let _updateProduct
            if (is_donation) {
                _updateProduct = await db.UserProducts.update(
                    {
                        name: product_name,
                        price: '0',
                        is_donation: is_donation,
                        is_trade: is_trade,
                        images: productImage,
                        quantity: quantity,
                        discount: discount,
                        unit: unit,
                        available_from: _available_from,
                        available_to: formattedDate_available_to,
                        is_delivery,
                        is_pickUp,
                        distance,
                        caption,
                        none,
                        allow_per_person,
                        category_id: category_id,
                        isUnlimitted: isUnlimitted
                    },
                    {
                        where: {
                            id: product_id,
                        }
                    }
                )
            } else if (is_trade) {
                _updateProduct = await db.UserProducts.update(
                    {
                        name: product_name,
                        price: price,
                        is_donation: is_donation,
                        is_trade: is_trade,
                        images: productImage,
                        quantity: quantity,
                        discount: discount,
                        unit: unit,
                        available_from: _available_from,
                        available_to: formattedDate_available_to,
                        allow_to_0rder,
                        allow_to_0rder_advance,
                        is_delivery,
                        is_pickUp,
                        distance,
                        caption,
                        none,
                        category_id: category_id,
                        isUnlimitted: isUnlimitted
                    },
                    {
                        where: {
                            id: product_id,
                        }
                    }
                )

                let product = await db.UserProducts.findOne({ where: { id: product_id } })
                let data = await db.userTrades.findOne({ where: { product_id: product.id } })
                if (!data) {
                    await db.userTrades.create({ product_id: product_id, title: trade_with })
                } else {
                    await db.userTrades.update({ title: trade_with }, { where: { product_id: product_id } })
                }
            } else {
                _updateProduct = await db.UserProducts.update(
                    {
                        name: product_name,
                        price: price,
                        is_donation: is_donation,
                        is_trade: is_trade,
                        images: productImage,
                        quantity: quantity,
                        discount: discount,
                        unit: unit,
                        available_from: _available_from,
                        available_to: formattedDate_available_to,
                        allow_to_0rder,
                        allow_to_0rder_advance,
                        is_delivery,
                        is_pickUp,
                        distance,
                        caption,
                        none,
                        category_id: category_id,
                        isUnlimitted: isUnlimitted
                    },
                    {
                        where: {
                            id: product_id,
                        }
                    }
                )
            }

            if (is_organic == false) {
                await db.UserProducts.update(
                    {
                        is_organic: false
                    },
                    {
                        where: {
                            id: product_id
                        }
                    }
                )
                let check = await db.ChemicalDetail.findAll({
                    where: {
                        product_id: product_id
                    }
                })
                if (check) {
                    await db.ChemicalDetail.destroy({
                        where: {
                            product_id: product_id
                        }
                    })
                }
                for (const info of chemical_id) {
                    await db.ChemicalDetail.create({
                        chemical_id: info,
                        product_id: product_id
                    })
                }
            } else {
                await db.UserProducts.update(
                    {
                        is_organic: true
                    },
                    {
                        where: {
                            id: product_id
                        }
                    }
                )
                await db.ChemicalDetail.destroy({
                    where: {
                        product_id: product_id
                    }
                })
            }

            if (_updateProduct[0]) {
                return {
                    data: { productUpdated: _updateProduct },
                    status: true,
                    message: `Product updated successfully`
                }
            } else {
                return {
                    status: false,
                    message: `error`
                }
            }
        } else {
            return {
                status: false,
                message: `error`
            }
        }
        // return {
        //     status: true,
        //     message: 'reported product is updated',
        //     data: updateProduct
        // }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteEvent = async (req) => {
    const { id } = req.params
    let _event = await db.Events.findOne({ where: { id: id } })

    if (_event) {
        await db.Events.destroy({
            where: { id: id }
        })
        return {
            status: true,
            message: `Event is deleted`
        }
    }
    return {
        status: false,
        message: `Failed to delete event`
    }
}

const deletePost = async (req) => {
    const { id } = req.params

    const post = await db.Posts.findOne({ where: { id: id } })
    if (post) {
        if (post.images.length) {
            let imageData = post.images
            console.log('image data ---------------------', imageData)
            await deleteMultipleImage(imageData)
        }

        const _deletedPost = await db.Posts.destroy({
            where: {
                id: id
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

const reportedEvent = async (req) => {
    try {
        const { event_id, reason } = req.body
        const u_id = await getUserIdFromToken(req)
        let checkEvent = await db.Events.findOne({ where: { id: event_id } })
        let allready_reported = await db.reportedEvent.findOne({ where: { u_id: u_id, event_id: event_id } })
        if (allready_reported) {
            return {
                status: false,
                message: 'event  is allready reported by user'
            }
        }
        if (checkEvent) {
            let reported = await db.reportedEvent.create({
                u_id: u_id,
                event_id: event_id,
                reason: reason
            })
            return {
                status: true,
                message: 'event  is reported',
                data: reported
            }
        } else {
            return {
                status: false,
                message: 'event is not exist'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const addNotes = async (req) => {
    try {
        const { note_type, remarks, id } = req.body
        const u_id = await getUserIdFromToken(req)
        const adminData = await db.Admin.findOne({ where: { id: u_id } })
        if (remarks && id && note_type) {
            if (note_type == 'Order') {
                let orderNote = await db.orderNote.create({
                    u_id: u_id,
                    check_out_id: id,
                    noteDate: new Date(),
                    remarks: remarks
                })
                orderNote.name = adminData.email
                return {
                    status: true,
                    message: 'Note Added',
                    data: orderNote
                }
            }
            else if (note_type == 'Payment') {

            }
            else {
                return {
                    status: false,
                    message: 'Invalid Data'
                }
            }
        }
        else {
            return {
                status: false,
                message: 'Invalid Data'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getreportedEvent = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        let reportedEvent = await db.reportedEvent.findAndCountAll({
            limit: limit,
            offset: offset,
            include: [
                {
                    model: db.Events,
                    as: 'reported_event',
                    // attributes: ['id', 'name', 'u_id', 'quantity', 'images', 'price'],
                    where: {
                        status: false
                    },
                    include: [
                        {
                            association: 'joinEvent',
                            include: [
                                {
                                    association: 'joinEventUser'
                                }
                            ]
                        },

                        {
                            model: db.User,
                            as: 'userEvents',
                            attributes: ['id', 'first_name', 'last_name', 'lat', 'log', 'image']
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'user_that_report_event',
                    attributes: ['id', 'first_name', 'last_name', 'lat', 'log', 'image']
                }
            ],
            order: [['createdAt', 'DESC']]
        })
        const reported_event_count = await db.reportedEvent.count({
            include: [
                {
                    model: db.Events,
                    as: 'reported_event',
                    where: {
                        status: false
                    }
                }
            ],
            where: {
                '$reported_event.status$': false
            }
        })

        const block_event_count = await db.reportedEvent.count({
            include: [
                {
                    model: db.Events,
                    as: 'reported_event',
                    where: {
                        status: true
                    }
                }
            ],
            where: {
                '$reported_event.status$': true
            }
        })
        const remainingCount = reportedEvent?.count - (offset + reportedEvent?.rows.length)
        return {
            status: true,
            message: 'Event reported data',
            data: { reportedEvent: reportedEvent.rows, count: reportedEvent.count, remaining: remainingCount, page: req.query.page, reported_event_count: reported_event_count, block_event_count }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}


const deleteReportedEvent = async (req) => {
    try {
        const { id } = req.params
        const { event_id } = req.params
        let checkEvent = await db.reportedEvent.findOne({
            where: {
                id: id
            }
        })
        if (checkEvent) {
            await db.reportedEvent.destroy({
                where: {
                    id: id
                }
            })
            await db.Events.destroy({
                where: {
                    id: event_id
                }
            })

            await db.reportedEvent.destroy({
                where: {
                    event_id: event_id
                }
            })

            return {
                status: true,
                message: 'reported Event is deleted'
            }
        } else {
            return {
                status: false,
                message: 'event is not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getreportedEventSearch = async (req) => {
    try {
        const { search } = req.body
        let reportedProduct = await db.reportedEvent.findAll({
            include: [
                {
                    model: db.Events,
                    as: 'reported_event',
                    // attributes: ['id', 'name', 'u_id', 'quantity', 'images', 'price'],
                    where: {
                        status: false
                    },
                    include: [
                        {
                            association: 'joinEvent',
                            include: [
                                {
                                    association: 'joinEventUser'
                                }
                            ]
                        },

                        {
                            model: db.User,
                            as: 'userEvents',
                            attributes: ['id', 'first_name', 'last_name', 'lat', 'log', 'image']
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'user_that_report_event',
                    attributes: ['id', 'first_name', 'last_name', 'lat', 'log', 'image']
                }
            ],
            where: {
                [db.Op.or]: [
                    {
                        '$reported_event.title$': {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$reported_event.userEvents.first_name$': {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$reported_event.price$': {
                            [db.Op.like]: `%${search}%`
                        }
                    }
                ],
                '$reported_event.status$': false
            }
        })
        return {
            status: true,
            message: 'product  search data',
            data: reportedProduct
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getreportedBlockEventSearch = async (req) => {
    try {
        const { search } = req.body
        let reportedProduct = await db.reportedEvent.findAll({
            include: [
                {
                    model: db.Events,
                    as: 'reported_event',
                    // attributes: ['name', 'u_id', 'quantity', 'images'],
                    include: [
                        {
                            model: db.User,
                            as: 'userEvents',
                            attributes: ['id', 'first_name', 'last_name']
                        }
                    ]
                }
            ],
            where: {
                [db.Op.or]: [
                    {
                        '$reported_event.title$': {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$reported_event.userEvents.first_name$': {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$reported_event.price$': {
                            [db.Op.like]: `%${search}%`
                        }
                    }
                ],
                '$reported_event.status$': true
            }
        })
        return {
            status: true,
            message: 'product  search data',
            data: reportedProduct
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const reportedPost = async (req) => {
    try {
        const { post_id, reason } = req.body
        const u_id = await getUserIdFromToken(req)
        let checkPost = await db.Posts.findOne({ where: { id: post_id } })
        let allready_reported = await db.reportedPost.findOne({ where: { u_id: u_id, post_id: post_id } })
        if (allready_reported) {
            return {
                status: false,
                message: 'post is allready reported'
            }
        }
        if (checkPost) {
            let reported = await db.reportedPost.create({
                u_id: u_id,
                post_id: post_id,
                reason: reason
            })
            return {
                status: true,
                message: 'post is reported',
                data: reported
            }
        } else {
            return {
                status: false,
                message: 'post is not exist'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getreportedPost = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        let reportedEvent = await db.reportedPost.findAndCountAll({
            limit: limit,
            offset: offset,
            include: [
                {
                    model: db.Posts,
                    as: 'reported_post',
                    where: {
                        status: false
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'user_that_report',
                    attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        const reported_Post_count = await db.reportedPost.count({
            include: [
                {
                    model: db.Posts,
                    as: 'reported_post',
                    where: {
                        status: false
                    }
                }
            ],
            where: {
                '$reported_post.status$': false
            }
        })
        const block_Post_count = await db.Posts.count({
            where: {
                status: true
            }
        })

        const remainingCount = reportedEvent?.count - (offset + reportedEvent?.rows.length)
        return {
            status: true,
            message: 'Event reported data',
            data: { reportedEvent: reportedEvent.rows, count: reportedEvent.count, remaining: remainingCount, page: req.query.page, reported_Post_count, block_Post_count }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getOrderNotes = async (req) => {
    try {
        const { id } = req.params
        let orderNotes = await db.orderNote.findAll({
            include: [
                {
                    model: db.Admin,
                    as: 'orderNotes',
                    attributes: ['email']
                },
            ],
            where: { check_out_id: id },
            order: [['noteDate', 'ASC']]
        })
        return {
            status: true,
            message: 'Order Notes',
            data: { orderNotes }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteReportedPost = async (req) => {
    try {
        const { id } = req.params
        const { post_id } = req.params
        let checkEvent = await db.reportedPost.findOne({
            where: {
                id: id
            }
        })
        if (checkEvent) {
            await db.reportedPost.destroy({
                where: {
                    id: id
                }
            })
            await db.Posts.destroy({
                where: {
                    id: post_id
                }
            })
            await db.reportedPost.destroy({
                where: {
                    post_id: post_id
                }
            })

            return {
                status: true,
                message: 'report is deleted'
            }
        } else {
            return {
                status: false,
                message: 'post is not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getreportedPostSearch = async (req) => {
    try {
        const { search } = req.body
        let reportedPost = await db.reportedPost.findAll({
            // include: [
            //     {
            //         model: db.Posts,
            //         as: 'reported_post',
            //         where: {
            //             status: false
            //         },
            //         include: [
            //             {
            //                 model: db.User,
            //                 as: 'user',
            //                 attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
            //             }
            //         ]
            //     },
            //     {
            //         model: db.User,
            //         as: 'user_that_report',
            //         attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
            //     }
            // ],
            include: [
                {
                    model: db.Posts,
                    as: 'reported_post',
                    where: {
                        status: false
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'user_that_report',
                    attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
                }
            ],
            where: {
                [db.Op.or]: [
                    {
                        '$reported_post.description$': {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$reported_post.user.first_name$': {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$reported_post.title$': {
                            [db.Op.like]: `%${search}%`
                        }
                    }
                ],
                '$reported_post.status$': false
            }
        })
        return {
            status: true,
            message: 'post search data',
            data: reportedPost
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const updateReportedPost = async (req) => {
    try {
        const { post_id, title, description, images, privacy, future_post_date } = req.body
        const post = await db.Posts.findOne({ where: { id: post_id } })
        const imagess = typeof images == 'string' ? JSON.parse(images) : images
        if (post) {
            let prevImageData = typeof post?.images == 'string' ? JSON.parse(post?.images) : post?.images
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

            await db.Posts.update(
                { description: description || post.description, images: productImage.length ? productImage : post.images, title: title || post.title, privacy: privacy, future_post_date: future_post_date || post.future_post_date },
                {
                    where: {
                        id: post_id,
                    }
                }
            )
            return {
                status: true,
                message: 'reported post  is updated'
            }
        }
        return {
            status: false,
            message: 'post not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getreportedBlockPostSearch = async (req) => {
    try {
        const { search } = req.body
        let reportedPost = await db.Posts.findAll({
            attributes: {
                include: [
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = userPosts.id)`), 'total_likes_count'],

                    [db.sequelize.literal(`(SELECT COUNT(*) FROM userPostComments WHERE p_id = userPosts.id)`), 'total_comments_count'],
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM shareModels WHERE post_id = userPosts.id)`), 'total_share_count'],
                ]
            },
            include: [
                {
                    association: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'image', 'lat', 'log', 'display_location', 'display_phone', 'display_email', 'display_dob', 'display_profile', 'display_dob_full_format', 'disable', 'is_block', [db.sequelize.col('address'), 'location']],
                    where: {
                        disable: false
                    }
                }
            ],
            order: [['createdAt', 'DESC']],
            where: {
                status: true,
                [db.Op.or]: [{ description: { [db.Op.like]: '%' + search + '%' } }, { title: { [db.Op.like]: '%' + search + '%' } }]
            },
        })
        return {
            status: true,
            message: 'post search data',
            data: reportedPost
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getAllOrders = async (req) => {
    const { limit, offset } = await facetStage(req.query.page)

    const response = await db.Checkout.findAll({
        order: [['createdAt', 'DESC']],
        include: [
            {
                association: 'order_products',
                include: [{ association: 'product_orders', include: [{ association: 'user' }] }]
            },
            {
                association: 'user_orders'
            }
        ],
        offset: offset,
        limit: limit
    })

    if (response) {
        return {
            data: { orders: response },
            status: true,
            message: `get orders successfully `
        }
    } else {
        return {
            status: false,
            message: `error`
        }
    }
}

const allOrderSearch = async (req) => {
    try {
        const { search } = req.body
        const response = await db.Checkout.findAll({
            include: [
                {
                    association: 'order_products',
                    include: [{ association: 'product_orders', include: [{ association: 'user' }] }]
                },
                {
                    association: 'user_orders'
                }
            ],
            where: {
                [db.Op.or]: [
                    {
                        id: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$order_products.product_orders.user.first_name$': {
                            [db.Op.like]: `%${search}%`
                        }
                    }
                ]
            }
        })
        return {
            status: true,
            message: 'post search data',
            data: { orders: response }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const blockPost = async (req) => {
    try {
        const { post_id } = req.body

        await db.Posts.update(
            { status: true },
            {
                where: {
                    id: post_id
                }
            }
        )

        return {
            status: true,
            message: `post is block`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const blockEvent = async (req) => {
    try {
        const { event_id } = req.body

        await db.Events.update(
            { status: true },
            {
                where: {
                    id: event_id
                }
            }
        )

        return {
            status: true,
            message: `Event Block`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const blockProduct = async (req) => {
    try {
        const { product_id } = req.body

        await db.UserProducts.update(
            { is_block: true },
            {
                where: {
                    id: product_id
                }
            }
        )

        return {
            status: true,
            message: `product is  Block`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}
const unblockPost = async (req) => {
    try {
        const { post_id } = req.body

        await db.Posts.update(
            { status: false },
            {
                where: {
                    id: post_id
                }
            }
        )

        return {
            status: true,
            message: `post is unblock`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}
const unblockEvent = async (req) => {
    try {
        const { event_id } = req.body

        await db.Events.update(
            { status: false },
            {
                where: {
                    id: event_id
                }
            }
        )

        return {
            status: true,
            message: `Event unblock`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}
const unblockProduct = async (req) => {
    try {
        const { product_id } = req.body

        await db.UserProducts.update(
            { is_block: false },
            {
                where: {
                    id: product_id
                }
            }
        )

        return {
            status: true,
            message: `product is  unblock`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const getAllBlockPost = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)

        let allPosts = await db.Posts.findAndCountAll({
            attributes: {
                include: [
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM userLikes WHERE post_id = userPosts.id)`), 'total_likes_count'],

                    [db.sequelize.literal(`(SELECT COUNT(*) FROM userPostComments WHERE p_id = userPosts.id)`), 'total_comments_count'],
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM shareModels WHERE post_id = userPosts.id)`), 'total_share_count'],
                ]
            },
            include: [
                {
                    association: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'image', 'lat', 'log', 'display_location', 'display_phone', 'display_email', 'display_dob', 'display_profile', 'display_dob_full_format', 'disable', 'is_block', [db.sequelize.col('address'), 'location']],
                    where: {
                        disable: false
                    }
                }
            ],
            where: { status: true },
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset
        })

        const remainingCount = allPosts?.count - (offset + allPosts?.rows.length)
        const total = await db.Posts.count({ where: { status: true } })

        return {
            status: true,
            message: 'Event reported data',
            data: { blockPosts: allPosts.rows, count: allPosts.count, remaining: remainingCount, page: req.query.page, total }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getBlockEvent = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        let reportedEvent = await db.Events.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    association: 'joinEvent',
                    include: [
                        {
                            association: 'joinEventUser'
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'eventUser',
                    attributes: ['id', 'ref_id', 'first_name', 'last_name', 'lat', 'log', 'image']
                }
            ],
            where: { status: true }
        })
        const remainingCount = reportedEvent?.count - (offset + reportedEvent?.rows.length)



        return {
            status: true,
            message: 'Event reported data',
            data: { reportedEvent: reportedEvent.rows, count: reportedEvent.count, remaining: remainingCount, page: req.query.page }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getAllEvent = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        let events = await db.Events.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    association: 'joinEvent',
                    include: [
                        {
                            association: 'joinEventUser'
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'eventUser',
                    attributes: ['id', 'ref_id', 'first_name', 'last_name', 'lat', 'log', 'image']
                }
            ],
            where: { status: false }
        })

        const reported_event_count = await db.reportedEvent.count({
            include: [
                {
                    model: db.Events,
                    as: 'reported_event',
                    where: {
                        status: false
                    }
                }
            ],
            where: {
                '$reported_event.status$': false
            }
        })

        const block_event_count = await db.Events.count({ where: { status: true } })

        const remainingCount = events?.count - (offset + events?.rows.length)
        return {
            status: true,
            message: 'Event reported data',
            data: { events: events.rows, count: events.count, remaining: remainingCount, page: req.query.page, reported_event_count, block_event_count }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const searchAllEvent = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        const { filter } = req.query
        let events = await db.Events.findAndCountAll({
            limit: limit,
            offset: offset,
            where: { [db.Op.or]: [{ title: { [db.Op.like]: '%' + filter + '%' } }, { summary: { [db.Op.like]: '%' + filter + '%' } }], },
            include: [
                {
                    association: 'joinEvent',
                    include: [
                        {
                            association: 'joinEventUser'
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'eventUser',
                    attributes: ['id', 'first_name', 'last_name', 'lat', 'log', 'image']
                }
            ]
        })
        const remainingCount = events?.count - (offset + events?.rows.length)
        return {
            status: true,
            message: 'Event reported data',
            data: { events: events.rows, count: events.count, remaining: remainingCount, page: req.query.page }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// ahaddata
const getAllBlockProduct = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        let reportedProduct = await db.reportedProduct.findAndCountAll({
            limit: limit,
            offset: offset,
            include: [
                {
                    model: db.UserProducts,
                    as: 'reported_product',
                    // attributes: ['id', 'name', 'u_id', 'quantity', 'images', 'price', 'is_block'],

                    where: {
                        is_block: true
                    },

                    include: [
                        {
                            association: 'trade'
                        },
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'user_that_report_product',
                    attributes: ['id', 'first_name', 'last_name', 'lat', 'log']
                }
            ]
        })
        const remainingCount = reportedProduct?.count - (offset + reportedProduct?.rows.length)
        return {
            status: true,
            message: 'product reported data',
            data: { reportedProduct: reportedProduct.rows, count: reportedProduct.count, remaining: remainingCount, page: req.query.page }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const blockUser = async (req) => {
    try {
        const { u_id } = req.body

        await db.User.update(
            { is_block: true },
            {
                where: {
                    id: u_id
                }
            }
        )
        //block all product of user
        await db.UserProducts.update(
            {
                is_block: true
            },
            {
                where: {
                    u_id: u_id
                }
            }
        )
        //block all post of user
        await db.Posts.update(
            {
                status: true
            },
            {
                where: {
                    u_id: u_id
                }
            }
        )
        //block all events of user
        await db.Events.update(
            {
                status: true
            },
            {
                where: {
                    u_id: u_id
                }
            }
        )

        return {
            status: true,
            message: `user is  Block`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const unblockUser = async (req) => {
    try {
        const { u_id } = req.body

        await db.User.update(
            { is_block: false },
            {
                where: {
                    id: u_id
                }
            }
        )

        //unblock all product of user
        await db.UserProducts.update(
            {
                is_block: false
            },
            {
                where: {
                    u_id: u_id
                }
            }
        )
        //unblock all post of user
        await db.Posts.update(
            {
                status: false
            },
            {
                where: {
                    u_id: u_id
                }
            }
        )
        //unblock all events of user
        await db.Events.update(
            {
                status: false
            },
            {
                where: {
                    u_id: u_id
                }
            }
        )

        return {
            status: true,
            message: `user is  UN-Block`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const getblockUser = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        let block_user = await db.User.findAndCountAll({
            attributes: { exclude: ['password', 'login_token', 'auth_token', 'verification_code'] },
            where: {
                is_block: true
            },
            limit: limit,
            offset: offset
        })
        const remainingCount = block_user?.count - (offset + block_user?.rows.length)
        return {
            data: { block_user: block_user.rows, count: block_user.count, remaining: remainingCount, page: req.query.page },
            status: true,
            message: `block user data `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const getDeletedUser = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        let deleted_user = await db.User.findAndCountAll({
            where: {
                is_deleted: true
            },
            attributes: { exclude: ['password', 'login_token', 'auth_token', 'verification_code'] },
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
        })
        const remainingCount = deleted_user?.count - (offset + deleted_user?.rows.length)
        return {
            data: { deleted_user: deleted_user.rows, count: deleted_user.count, remaining: remainingCount, page: req.query.page },
            status: true,
            message: `block user data `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const updatereportedEvent = async (req) => {
    try {
        const { event_id, event_title, price, start_date, end_date, summary, location, latitude, longitude, image, isPrivate, privacy, limitTo, limitToNumber } = req.body

        let checkEvent = await db.Events.findOne({ where: { id: event_id } })
        let startDate = moment.tz(start_date, process.env.TIME_ZONE).format()
        let endDate = moment.tz(end_date, process.env.TIME_ZONE).format()
        let updateImage = ''
        if (checkEvent) {
            if (image && checkEvent.image != image) {
                await deleteImage(checkEvent.image)
                updateImage = await s3ImageUpload(image)
            } else {
                updateImage = checkEvent.image
            }

            await db.Events.update(
                {
                    title: event_title,
                    price: price,
                    start_date: startDate,
                    end_date: endDate,
                    summary: summary,
                    latitude: latitude || checkEvent.latitude,
                    longitude: longitude || checkEvent.longitude,
                    image: updateImage,
                    location: location ? location : checkEvent?.location,
                    is_private: isPrivate,
                    limit_to: limitTo || null,
                    limit_to_number: limitToNumber || null,
                    privacy: privacy
                },
                {
                    where: {
                        id: event_id
                    }
                }
            )
            return {
                status: true,
                message: 'reported event  is  updated'
            }
        } else {
            return {
                status: false,
                message: 'event is not exist'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const ManageOrder = async (req) => {
    try {
        const { from, to } = req.body

        // const fromDate = moment(from).format(' DD MMMM YYYY')
        // const toDate = moment(to).format(' DD MMMM YYYY')
        const fromDate = moment(from).startOf('day').toDate()
        const toDate = moment(to).endOf('day').toDate()
        const response = await db.Orders.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    association: 'seller_detail',
                    attributes: ['id', 'first_name', 'email', 'image', 'is_block_payment', 'phone', [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalSum']]
                }
            ],
            where: {
                createdAt: {
                    [db.Op.between]: [fromDate, toDate]
                },
                charge_gamba: true,
                '$seller_detail.is_block_payment$': false,
                '$seller_detail.is_block$': false
            },

            group: 'seller_id'
        })

        return {
            data: { response },
            status: true,
            message: 'reported event is updated'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const unPaidOrder = async (req) => {
    try {
        const { from, to } = req.body
        const { limit, offset } = await facetStage(req.query.page)
        // const fromDate = moment(from).format(' DD MMMM YYYY')
        // const toDate = moment(to).format(' DD MMMM YYYY')
        const fromDate = moment(from).startOf('day').toDate()
        const toDate = moment(to).endOf('day').toDate()
        const response = await db.Orders.findAndCountAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    association: 'seller_detail',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'image', 'is_block_payment', 'phone', [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalSum']]
                },
                {
                    association: 'bokingOrder',
                },
                { association: 'order' },

            ],
            where: {
                createdAt: {
                    [db.Op.between]: [fromDate, toDate]
                },
                charge_gamba: false,

                // createdAt: {
                //     [db.Op.gte]: fromDate,
                //     [db.Op.lte]: toDate
                // },
                '$seller_detail.is_block_payment$': false,
                '$seller_detail.is_block$': false
            },
            limit: limit,
            offset: offset,
            group: 'seller_id'
        })

        const remainingCount = response?.count - (offset + response?.rows?.length)
        return {
            data: { response: response?.rows, page: req.query.page, remaining: remainingCount },
            status: true,
            message: 'unpaid Order Record'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const SellerHistory = async (req) => {
    try {
        const { from, to, seller_id, unpaid } = req.body
        if (unpaid == false) {
            console.log('fromand to', from, to)
            const fromDate = moment(from).startOf('day').toDate()
            const toDate = moment(to).endOf('day').toDate()
            const response = await db.Checkout.findAll({
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        association: 'order_products',

                        where: {
                            createdAt: {
                                [db.Op.between]: [fromDate, toDate]
                            },
                            charge_gamba: false
                        },

                        include: [{ association: 'product_orders' }]
                    },
                    {
                        association: 'user_orders'
                    }
                ],
                where: {
                    '$order_products.seller_id$': seller_id
                }
            })

            return {
                data: response,
                status: true,
                message: 'seller history'
            }
        } else {
            const fromDate = moment(from).startOf('day').toDate()
            const toDate = moment(to).endOf('day').toDate()
            const response = await db.Checkout.findAll({
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        association: 'order_products',

                        where: {
                            createdAt: {
                                [db.Op.between]: [fromDate, toDate]
                            },
                            charge_gamba: true
                        },

                        include: [{ association: 'product_orders' }]
                    },
                    {
                        association: 'user_orders'
                    }
                ],
                where: {
                    '$order_products.seller_id$': seller_id
                }
            })

            return {
                data: response,
                status: true,
                message: 'seller history'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const ManagePaidOrder = async (req) => {
    try {
        const page = req.params.page || 1
        const whereCondition = { status: { [db.Op.or]: ['COMPLETED', null] } }
        const pageSize = 20
        const response = await db.Checkout.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    association: 'order_products',
                    attributes: { exclude: ['updatedAt', 'createdAt'] },
                    include: [
                        {
                            association: 'product_orders',
                            attributes: {
                                exclude: [
                                    'updatedAt', 'createdAt', 'isUnlimitted', 'allow_per_person', 'none', 'caption', 'distance', 'advance_order_in_weeks', 'advance_order_day',
                                    'allow_to_0rder_advance', 'allow_to_0rder', 'available_to', 'available_from'
                                ]
                            }
                        },
                        {
                            association: 'seller_detail',
                            attributes: ['id', 'ref_id', 'first_name', 'last_name', 'email', 'image', 'phone', 'lat', 'log', 'is_block', 'is_block_payment', 'dob', 'address', 'stripe_id', 'stripe_account_id']
                        }
                    ]
                },
                {
                    association: 'user_orders',
                    attributes: ['id', 'ref_id', 'first_name', 'last_name', 'email', 'image', 'phone', 'lat', 'log', 'is_block', 'is_block_payment', 'dob', 'address', 'stripe_id', 'stripe_account_id']
                },
            ],
            attributes: { exclude: ['updatedAt'] },
            where: whereCondition,
            limit: pageSize,
            offset: (page - 1) * pageSize
        })

        const totalRecords = await db.Checkout.count({ where: whereCondition });
        return {
            data: { response: response, page: page, remaining: totalRecords },
            status: true,
            message: 'Order Records'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const searchPaidOrder = async (req) => {
    try {
        const page = req.params.page || 1
        const { filter } = req.query
        const whereCondition = {
            [db.Op.or]: [
                {
                    id: {
                        [db.Op.like]: `%${filter}%`
                    }
                },
                {
                    '$user_orders.first_name$': {
                        [db.Op.like]: `%${filter}%`
                    }
                }
            ],
            status: { [db.Op.or]: ['COMPLETED', null] }
        };

        const response = await db.Checkout.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: db.Orders,
                    as: 'order_products',
                    include: [
                        {
                            model: db.UserProducts,
                            as: 'product_orders'
                        },
                        {
                            model: db.User,
                            as: 'seller_detail',
                            attributes: ['id', 'first_name', 'last_name', 'email']
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'user_orders',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                }
            ],
            where: whereCondition,
            limit: 20,
            offset: (page - 1) * 20
        });

        const totalRecords = await db.Checkout.count({ where: whereCondition })
        return {
            data: { response: response, page: page, remaining: totalRecords },
            status: true,
            message: 'Paid order data'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const ManageCancelledOrder = async (req) => {
    try {
        const page = req.params.page || 1
        const { from, to } = req.body
        const fromDate = from ? new Date(from) : ''
        const toDate = to ? new Date(to) : ''
        const whereCondition = fromDate && toDate ? { status: 'CANCELLED', createdAt: { [db.Op.between]: [fromDate, toDate.setDate(toDate.getDate() + 1)] } } : { status: 'CANCELLED' }
        const pageSize = 20
        const params = {
            limit: pageSize,
            status: 'submitted',
            starting_after: page
        }
        if (fromDate && toDate) {
            params.created = {
                gte: fromDate.getTime() / 1000,
                lte: toDate.getTime() / 1000,
            }
        }
        const disputes = await stripe.issuing.disputes.list();
        // disputes.data[0] = {
        //     "id": "idp_1MykdxFtDWhhyHE1BFAV3osZ",
        //     "object": "issuing.dispute",
        //     "amount": 100,
        //     "created": 1681947753,
        //     "currency": "usd",
        //     "evidence": {
        //       "fraudulent": {
        //         "additional_documentation": null,
        //         "dispute_explanation": null,
        //         "explanation": "This transaction is fraudulent.",
        //         "uncategorized_file": null
        //       },
        //       "reason": "fraudulent"
        //     },
        //     "livemode": false,
        //     "metadata": {},
        //     "status": "unsubmitted",
        //     "transaction": "ipi_1MykXhFtDWhhyHE1UjsZZ3xQ"
        //   }

        //   return {
        //       status: true,
        //       message: disputes
        //   }
        const response = await db.Checkout.findAll({
            order: [['status_date', 'DESC']],
            include: [
                {
                    association: 'order_products',
                    attributes: { exclude: ['updatedAt', 'createdAt'] },
                    include: [
                        {
                            association: 'product_orders',
                            attributes: {
                                exclude: [
                                    'updatedAt', 'createdAt', 'isUnlimitted', 'allow_per_person', 'none', 'caption', 'distance', 'advance_order_in_weeks', 'advance_order_day',
                                    'allow_to_0rder_advance', 'allow_to_0rder', 'available_to', 'available_from'
                                ]
                            }
                        },
                        {
                            association: 'seller_detail',
                            attributes: ['id', 'ref_id', 'first_name', 'last_name', 'email', 'image', 'phone', 'lat', 'log', 'is_block', 'is_block_payment', 'dob', 'address', 'stripe_id', 'stripe_account_id']
                        }
                    ]
                },
                {
                    association: 'user_orders',
                    attributes: ['id', 'ref_id', 'first_name', 'last_name', 'email', 'image', 'phone', 'lat', 'log', 'is_block', 'is_block_payment', 'dob', 'address', 'stripe_id', 'stripe_account_id']
                },
            ],
            attributes: { exclude: ['updatedAt'] },
            where: whereCondition,
            limit: pageSize,
            offset: (page - 1) * pageSize
        })

        const totalRecords = await db.Checkout.count({ where: whereCondition });
        return {
            data: { response: response, page: page, remaining: totalRecords },
            status: true,
            message: 'Cancelled Order Records'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const cancelOrder = async (req) => {
    try {
        const id = req.params.id
        await db.Checkout.update({ status: 'CANCELLED', status_date: new Date() }, { where: { id: id } })
        const checkout = await db.Checkout.findOne({
            include: [{ association: 'order_products', include: [{ association: 'product_orders' }, { association: 'seller_detail' }] }, { association: 'user_orders' },],
            where: { id: id },
        })
        await db.Orders.update({ charge_gamba: false }, { where: { c_id: checkout.id } })
        const paymentDetails = await db.paymentHistory.findOne({ where: { checkout_id: checkout.id } })
        await db.paymentHistory.update({ status: 'REFUNDED', }, { where: { checkout_id: checkout.id } })
        let charge = {}
        if (paymentDetails.confirmation_no) {
            charge = await stripe.charges.retrieve(paymentDetails.confirmation_no);
        }
        if (charge.id) {
            try {
                await stripe.refunds.create({
                    charge: paymentDetails.confirmation_no,
                });
            }
            catch (e) { }
            await db.pendingTransfers.update({
                status: 'CANCELLED',
                remarks: 'Admin Caclled The Order'
            },
                {
                    where: {
                        order_id: id,
                        status: { [db.Op.notIn]: ['SUCCESS', 'CANCELLED'] }
                    },
                })

            try {
                const results = await db.pendingTransfers.findAll({ where: { order_id: id, status: 'SUCCESS' } });
                for (const result of results) {
                    const reversal = await stripe.transfers.createReversal(
                        result.transaction_id,
                        {
                            amount: result.amount,
                            description: 'Buyer Cancelled The Order',
                        }
                    );
                    await db.pendingTransfers.update({
                        status: 'CANCELLED',
                        remarks: 'Payment Revise Request Sent. If The Customer Account Has Sufficiant Amount The Transaction Will Be Revised Revisal Id : ' + reversal.id
                    },
                        {
                            where: { id: result.id, },
                        })
                }
            } catch (error) {
            }

        }
        return {
            status: true,
            message: 'Order Cancelled'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const SellerTotal = async (req) => {
    try {
        const { seller_id } = req.body

        const response = await db.Orders.findAll({
            where: {
                seller_id: seller_id
            },
            attributes: ['seller_id', [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalSum']]
        })

        return {
            data: response,
            status: true,
            message: 'seller history'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const blockUserForPayment = async (req) => {
    try {
        const { u_id } = req.body

        await db.User.update(
            { is_block_payment: true },
            {
                where: {
                    id: u_id
                }
            }
        )
        //block all product of user
        await db.UserProducts.update(
            {
                is_block: true
            },
            {
                where: {
                    u_id: u_id
                }
            }
        )
        //block all post of user
        await db.Posts.update(
            {
                status: true
            },
            {
                where: {
                    u_id: u_id
                }
            }
        )
        //block all events of user
        await db.Events.update(
            {
                status: true
            },
            {
                where: {
                    u_id: u_id
                }
            }
        )

        return {
            status: true,
            message: `user is  Block `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}
const ViewAllDisputedUser = async (req) => {
    try {
        const response = await db.Orders.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    association: 'seller_detail',
                    attributes: ['id', 'first_name', 'email', 'image', 'is_block_payment', [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalSum']]
                }
            ],
            where: {
                '$seller_detail.is_block_payment$': true
            },
            group: 'seller_id'
        })

        return {
            data: { response },
            status: true,
            message: 'Disputed User List '
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const removeUserFromEvent = async (req) => {
    const { u_id, event_id } = req.body
    try {
        await db.joinEvent.destroy({
            where: {
                u_id: u_id,
                event_id: event_id
            }
        })
        return {
            status: true,
            message: ` User is remove from event `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const chargeSeller = async (req) => {
    const { seller_id, total, name, order_number } = req.body
    const result = (total * 5) / 100
    try {
        const currentDate = moment()
        await db.paymentHistory.create({
            date_paid: currentDate,
            checkout_id: order_number,
            total: total,
            amount_paid_to_gamba: result
        })
        const response = await db.Orders.update(
            {
                charge_gamba: true
            },
            {
                where: {
                    seller_id: seller_id
                }
            }
        )
        console.log('resdata', response)
        if (!response) {
            console.log('disputed record')
        }
        return {
            status: true,
            message: ` Seller is charge `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}
const paymentHistoryGamba = async (req) => {
    try {
        const page = req.params.page || 1
        const pageSize = 20
        const response = await db.paymentHistory.findAll({
            order: [['date_paid', 'DESC']],
            include: [
                {
                    association: 'payment_order',
                    include: [
                        {
                            association: 'order_products',
                            attributes: { exclude: ['updatedAt', 'createdAt'] },
                            include: [
                                {
                                    association: 'product_orders',
                                    attributes: {
                                        exclude: [
                                            'updatedAt', 'createdAt', 'isUnlimitted', 'allow_per_person', 'none', 'caption', 'distance', 'advance_order_in_weeks', 'advance_order_day',
                                            'allow_to_0rder_advance', 'allow_to_0rder', 'available_to', 'available_from'
                                        ]
                                    }
                                },
                                {
                                    association: 'seller_detail',
                                    attributes: ['id', 'ref_id', 'first_name', 'last_name', 'email', 'image', 'phone', 'lat', 'log', 'is_block', 'is_block_payment', 'dob', 'address', 'stripe_id', 'stripe_account_id']
                                }
                            ]
                        },
                        {
                            association: 'user_orders',
                            attributes: ['id', 'ref_id', 'first_name', 'last_name', 'email', 'image', 'phone', 'lat', 'log', 'is_block', 'is_block_payment', 'dob', 'address', 'stripe_id', 'stripe_account_id']
                        },
                    ],
                    attributes: { exclude: ['updatedAt'] },
                }
            ],
            attributes: { exclude: ['updatedAt', 'createdAt'] },
            limit: pageSize,
            offset: (page - 1) * pageSize
        })

        const totalRecords = await db.paymentHistory.count();
        return {
            data: { response: response, page: page, remaining: totalRecords },
            status: true,
            message: 'Payment History Gamba'
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const userSearchBlock = async (req) => {
    try {
        const { search } = req.body
        const searchTerms = search.split(' ');
        let reportedProduct = await db.User.findAll({
            where: {
                [db.Op.or]: [
                    {
                        [db.Op.and]: searchTerms.map((term) => ({
                            [db.Op.or]: [
                                {
                                    first_name: {
                                        [db.Op.like]: `%${term}%`,
                                    },
                                },
                                {
                                    last_name: {
                                        [db.Op.like]: `%${term}%`,
                                    },
                                },
                            ],
                        })),
                    },
                    {
                        email: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        phone: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        first_name: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        last_name: {
                            [db.Op.like]: `%${search}%`
                        }
                    }
                ],
                is_block: true
            }
        })
        return {
            status: true,
            message: 'block  search data',
            data: { user: reportedProduct, query: search }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}
const userSearchDisable = async (req) => {
    try {
        const { search } = req.body
        const searchTerms = search.split(' ');
        let reportedProduct = await db.User.findAll({
            where: {
                [db.Op.or]: [
                    {
                        [db.Op.and]: searchTerms.map((term) => ({
                            [db.Op.or]: [
                                {
                                    first_name: {
                                        [db.Op.like]: `%${term}%`,
                                    },
                                },
                                {
                                    last_name: {
                                        [db.Op.like]: `%${term}%`,
                                    },
                                },
                            ],
                        })),
                    },
                    {
                        email: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        phone: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        first_name: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        last_name: {
                            [db.Op.like]: `%${search}%`
                        }
                    }
                ],
                disable: true
            }
        })
        return {
            status: true,
            message: 'disable user search data',
            data: { user: reportedProduct, query: search }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

export {
    updateAdminPassword, resetPassword, getDeletedUser, updateAdminProfile, getAdminProfile, deleteProduct, viewAllPosts,
    searchPosts, getAllProductGood, searchProductGood, searchAllEvent, getAllEvent, adminLogin, viewStats, userProfileUpdated,
    updateUser, viewAllUserTaste, exportAllUsers, blockReportedUser, unBlockUser, reportedProduct, getreportedProduct, getreportedProductSearch,
    deleteReportedProduct, updateReportedProduct, deleteEvent, deletePost, reportedEvent, getreportedEvent, deleteReportedEvent, getreportedEventSearch,
    reportedPost, getreportedPost, deleteReportedPost, getreportedPostSearch, userSearch, deleteUser, getAllOrders, allOrderSearch, blockPost, blockEvent,
    blockProduct, unblockPost, unblockEvent, unblockProduct, getAllBlockPost, getBlockEvent, getAllBlockProduct, blockUser, unblockUser, getblockUser,
    updatereportedEvent, getreportedBlockPostSearch, getreportedBlockEventSearch, getBlockproductSearch, updateReportedPost, ManageOrder, SellerHistory,
    SellerTotal, blockUserForPayment, ViewAllDisputedUser, removeUserFromEvent, unPaidOrder, chargeSeller, paymentHistoryGamba, userSearchBlock,
    userSearchDisable, stripeTransferDetails, ManagePaidOrder, searchPaidOrder, addNotes, getOrderNotes, cancelOrder, ManageCancelledOrder
}
