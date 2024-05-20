import Sequelize from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()


import adminModel from './admin.js'
import postCommentsModel from './postComments.js'
import categoryModel from './category.js'
import productChemicalModel from './productChemical.js'
import chemicalModel from './chemical.js'
import ordersModel from './orders.js'
import userModel from './user.js'
import postLikesModel from './postLikes.js'
import userNotificationModel from './userNotification.js'
import pendingTransfersModel from './pendingTransfers.js'
import fcmNotificationModel from './fcmNotification.js'
import userProductsModel from './userProducts.js'
import postsModel from './posts.js'
import eventsModel from './events.js'
import checkoutModel from './checkout.js'
import orderNNotesModel from './order_notes.js'
import tradesModel from './trade.js'
import addToCartModel from './addToCart.js'
import paypalTransaction from './paypal.js'
import favoritesModel from './favorite.js'
import reportedProductModel from './reportedProduct.js'
import reportedEventModel from './reportedEvent.js'
import reportedPostModel from './reportedPost.js'
import ratingModel from './rating.js'
import userPostCommentModel from './postComment.js'
import userPostReplyModel from './userPostReply.js'
import likedCommentModel from './likeComment.js'
import joinEventModel from './joinEvent.js'
import contectUsModel from './contectUs.js'
import chemicalDetailProductModel from './chemicalDetailProduct.js'
import notificationModel from './notification.js'
import hidePostModel from './hidePost.js'
import hideEventModel from './hideEvent.js'
import hideSellerModel from './hideSeller.js'
import notificationSettingModel from './notificationSetting.js'
import favoriteSellerModel from './favoriteSeller.js'
import paymentHistoryModel from './paymentHistory.js'
import userPrivacySettingModel from './userPrivacySetting.js'
import disLikeCommentModel from './commentDislike.js'
import userProfileLikesModel from './userProfileLikes.js'
import userProfileDisLikesModel from './userProfileDisLikes.js'
import sharePostModel from './shareModel.js'
import orderReportModel from './orderReport.js'
const config = {
    username: process.env.DBUSERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORT,
    database: process.env.DATABASE,
    logging: false
}

const db = {}
const { Op, QueryTypes } = Sequelize
let sequelize = new Sequelize(config.database, config.username, config.password, config)

db.Op = Op
db.QueryTypes = QueryTypes
db.sequelize = sequelize

//admin
db.Admin = adminModel(sequelize, Sequelize.DataTypes)
db.Chemicals = chemicalModel(sequelize, Sequelize.DataTypes)
db.Categories = categoryModel(sequelize, Sequelize.DataTypes)

//users
db.User = userModel(sequelize, Sequelize.DataTypes)
db.UserNotification = userNotificationModel(sequelize, Sequelize.DataTypes)
db.FcmNotification = fcmNotificationModel(sequelize, Sequelize.DataTypes)


db.pendingTransfers = pendingTransfersModel(sequelize, Sequelize.DataTypes)

db.Posts = postsModel(sequelize, Sequelize.DataTypes)
db.PostLikes = postLikesModel(sequelize, Sequelize.DataTypes)
db.PostComments = postCommentsModel(sequelize, Sequelize.DataTypes)

db.UserProducts = userProductsModel(sequelize, Sequelize.DataTypes)
db.ProductChemical = productChemicalModel(sequelize, Sequelize.DataTypes)
db.Orders = ordersModel(sequelize, Sequelize.DataTypes)
db.userTrades = tradesModel(sequelize, Sequelize.DataTypes)

db.Events = eventsModel(sequelize, Sequelize.DataTypes)
db.Checkout = checkoutModel(sequelize, Sequelize.DataTypes)
db.orderNote = orderNNotesModel(sequelize, Sequelize.DataTypes)
db.favorite = favoritesModel(sequelize, Sequelize.DataTypes)
db.reportedProduct = reportedProductModel(sequelize, Sequelize.DataTypes)
db.reportedEvent = reportedEventModel(sequelize, Sequelize.DataTypes)
db.reportedPost = reportedPostModel(sequelize, Sequelize.DataTypes)
db.rating = ratingModel(sequelize, Sequelize.DataTypes)
db.UserPostComment = userPostCommentModel(sequelize, Sequelize.DataTypes)
db.UserPostReply = userPostReplyModel(sequelize, Sequelize.DataTypes)
db.UserLikeComment = likedCommentModel(sequelize, Sequelize.DataTypes)
db.joinEvent = joinEventModel(sequelize, Sequelize.DataTypes)
db.contectUs = contectUsModel(sequelize, Sequelize.DataTypes)
db.ChemicalDetail = chemicalDetailProductModel(sequelize, Sequelize.DataTypes)
db.notification = notificationModel(sequelize, Sequelize.DataTypes)
db.hidePost = hidePostModel(sequelize, Sequelize.DataTypes)
db.hideEvent = hideEventModel(sequelize, Sequelize.DataTypes)
db.hideSeller = hideSellerModel(sequelize, Sequelize.DataTypes)
db.notificationSetting = notificationSettingModel(sequelize, Sequelize.DataTypes)
db.favoriteSeller = favoriteSellerModel(sequelize, Sequelize.DataTypes)
db.paymentHistory = paymentHistoryModel(sequelize, Sequelize.DataTypes)
db.userPrivacysetting = userPrivacySettingModel(sequelize, Sequelize.DataTypes)
db.DisLikeComment = disLikeCommentModel(sequelize, Sequelize.DataTypes)
db.UserProfileLikes = userProfileLikesModel(sequelize, Sequelize.DataTypes)
db.UserProfileDisLikes = userProfileDisLikesModel(sequelize, Sequelize.DataTypes)
db.SharePost = sharePostModel(sequelize, Sequelize.DataTypes)
db.OrderReport = orderReportModel(sequelize, Sequelize.DataTypes)

// relations

db.User.hasMany(db.OrderReport, { foreignKey: 'u_id', as: 'reportedUser' })
db.OrderReport.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'reportedUser'
})

db.User.hasMany(db.pendingTransfers, { foreignKey: 'u_id', as: 'pendingTransferUser' })
db.pendingTransfers.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'pendingTransferUser'
})

db.Checkout.hasMany(db.pendingTransfers, { foreignKey: 'order_id', as: 'pendingTransfesOrder' })
db.pendingTransfers.belongsTo(db.Checkout, {
    foreignKey: 'order_id',
    as: 'pendingTransfesOrder'
})

db.Admin.hasMany(db.orderNote, { foreignKey: 'u_id', as: 'orderNotes' })
db.orderNote.belongsTo(db.Admin, {
    foreignKey: 'u_id',
    as: 'orderNotes'
})

db.Checkout.hasMany(db.orderNote, { foreignKey: 'check_out_id', as: 'checkoutNotes' })
db.orderNote.belongsTo(db.Checkout, {
    foreignKey: 'check_out_id',
    as: 'checkoutNotes'
})


db.User.hasMany(db.pendingTransfers, { foreignKey: 'purchased_by_id', as: 'pendingTransfersPurchasedBy' })
db.pendingTransfers.belongsTo(db.User, {
    foreignKey: 'purchased_by_id',
    as: 'pendingTransfersPurchasedBy'
})

db.Orders.hasOne(db.OrderReport, { foreignKey: 'order_id', as: 'bokingOrder' })
db.OrderReport.belongsTo(db.Orders, {
    foreignKey: 'order_id',
    as: 'bokingOrder'
})

db.User.hasMany(db.SharePost, { foreignKey: 'u_id', as: 'shareUser' })
db.SharePost.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'shareUser'
})

db.Posts.hasMany(db.SharePost, { foreignKey: 'post_id', as: 'sharePost' })
db.SharePost.belongsTo(db.Posts, {
    foreignKey: 'post_id',
    as: 'sharePost'
})

db.UserProducts.hasMany(db.SharePost, { foreignKey: 'product_id', as: 'shareProduct' })
db.SharePost.belongsTo(db.UserProducts, {
    foreignKey: 'product_id',
    as: 'shareProduct'
})

db.Events.hasMany(db.SharePost, { foreignKey: 'event_id', as: 'shareEvent' })
db.SharePost.belongsTo(db.Events, {
    foreignKey: 'event_id',
    as: 'shareEvent'
})

db.User.hasMany(db.UserProducts, { foreignKey: 'u_id', as: 'userProducts' })
db.UserProducts.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'user'
})

// user profile likes
db.User.hasMany(db.UserProfileLikes, { foreignKey: 'u_id', as: 'likedFromUser' })
db.UserProfileLikes.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'likedFromUser'
})

// user profile likes
db.User.hasMany(db.UserProfileLikes, { foreignKey: 'f_id', as: 'likedToUser' })
db.UserProfileLikes.belongsTo(db.User, {
    foreignKey: 'f_id',
    as: 'likedToUser'
})

// user profile Dislikes
db.User.hasMany(db.UserProfileDisLikes, { foreignKey: 'u_id', as: 'dislikedFromUser' })
db.UserProfileDisLikes.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'likedFromUser'
})

// user profile Dislikes
db.User.hasMany(db.UserProfileDisLikes, { foreignKey: 'f_id', as: 'dislikedToUser' })
db.UserProfileDisLikes.belongsTo(db.User, {
    foreignKey: 'f_id',
    as: 'dislikedToUser'
})

//reported product and product good relation

db.UserProducts.hasMany(db.reportedProduct, { foreignKey: 'product_id', as: 'reported_product' })
db.reportedProduct.belongsTo(db.UserProducts, { foreignKey: 'product_id', as: 'reported_product' })

//reported event and event relationship
db.Events.hasMany(db.reportedEvent, { foreignKey: 'event_id', as: 'reported_event' })
db.reportedEvent.belongsTo(db.Events, { foreignKey: 'event_id', as: 'reported_event' })

//reported post and post relationship
db.Posts.hasMany(db.reportedPost, { foreignKey: 'post_id', as: 'reported_post' })
db.reportedPost.belongsTo(db.Posts, { foreignKey: 'post_id', as: 'reported_post' })

//reported post and user relationship
db.User.hasMany(db.reportedPost, { foreignKey: 'u_id', as: 'user_that_report' })
db.reportedPost.belongsTo(db.User, { foreignKey: 'u_id', as: 'user_that_report' })
//reported event and user relationship
db.User.hasMany(db.reportedEvent, { foreignKey: 'u_id', as: 'user_that_report_event' })
db.reportedEvent.belongsTo(db.User, { foreignKey: 'u_id', as: 'user_that_report_event' })

//reported product and user relation
db.User.hasMany(db.reportedProduct, { foreignKey: 'u_id', as: 'user_that_report_product' })
db.reportedProduct.belongsTo(db.User, { foreignKey: 'u_id', as: 'user_that_report_product' })

//user and fev relationship
db.User.hasMany(db.favorite, { foreignKey: 'u_id', as: 'favorite' })
db.favorite.belongsTo(db.User, { foreignKey: 'u_id', as: 'favorite' })

//product and fev relationship
db.UserProducts.hasMany(db.favorite, { foreignKey: 'product_id', as: 'fev-product' })
db.favorite.belongsTo(db.UserProducts, { foreignKey: 'product_id', as: 'fev-product' })

// db.Categories.hasOne(db.UserProducts, {foreignKey: 'category_id', as: 'userCategory'})

// db.UserProducts.belongsTo(db.Categories, {
//     foreignKey: 'category_id',
//     as: 'userCategory'
// })

db.User.hasMany(db.Posts, { foreignKey: 'u_id', as: 'posts' })

db.Posts.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'user'
})

db.Posts.hasMany(db.PostLikes, { foreignKey: 'post_id', as: 'postLikes' })
db.PostLikes.belongsTo(db.Posts, { foreignKey: 'post_id', as: 'postLikes' })

// db.User.hasMany(db.User, {foreignKey: 'u_id', as: 'like_user'})
db.PostLikes.belongsTo(db.User, { foreignKey: 'u_id', as: 'like_user' })

db.Posts.hasMany(db.PostComments, {
    foreignKey: 'post_id',
    as: 'postComments'
})
db.PostComments.belongsTo(db.Posts, {
    foreignKey: 'post_id',
    as: 'postComments'
})

//product and trade relation
db.UserProducts.hasMany(db.userTrades, { foreignKey: 'product_id', as: 'trade' })
db.userTrades.belongsTo(db.UserProducts, { foreignKey: 'product_id', as: 'trade' })

//chemical relation with product good

db.Chemicals.hasOne(db.UserProducts, { foreignKey: 'chemical_id', as: 'chemicall' })
db.UserProducts.belongsTo(db.Chemicals, { foreignKey: 'chemical_id', as: 'chemicall' })

// Categories relationship with product
db.Categories.hasOne(db.UserProducts, { foreignKey: 'category_id', as: 'category' })
db.UserProducts.belongsTo(db.Categories, { foreignKey: 'category_id', as: 'category' })

//product  relation with fev
// db.UserProducts.hasMany

// db.UserProducts.hasMany(db.ProductChemical, {
//     foreignKey: 'product_id',
//     as: 'productChemicals'
// })
// db.ProductChemical.belongsTo(db.UserProducts, {
//     foreignKey: 'product_id',
//     as: 'productChemicals'
// })

//todo.. need to check
// db.Chemicals.hasMany(db.ProductChemical, {
//     foreignKey: 'chemical_id',
//     as: 'chemicalList'
// })
// db.ProductChemical.belongsTo(db.Chemicals, {
//     foreignKey: 'chemical_id',
//     as: 'chemicalList'
// })

db.User.hasMany(db.Events, { foreignKey: 'u_id', as: 'userEvents' })
db.Events.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'userEvents'
})

// user -- checkout relation
db.User.hasMany(db.Checkout, { foreignKey: 'u_id', as: 'user_orders' })
db.Checkout.belongsTo(db.User, { foreignKey: 'u_id', as: 'user_orders' })

db.Checkout.hasOne(db.paymentHistory, { foreignKey: 'checkout_id', as: 'payment_order' })
db.paymentHistory.belongsTo(db.Checkout, { foreignKey: 'checkout_id', as: 'payment_order' })

// seller -- checkout relation
// db.User.hasMany(db.Checkout, {foreignKey: 'seller_id', as: 'seller_detail'})
// db.Checkout.belongsTo(db.User, {foreignKey: 'seller_id', as: 'seller_detail'})

db.User.hasMany(db.Orders, { foreignKey: 'seller_id', as: 'seller_detail' })
db.Orders.belongsTo(db.User, { foreignKey: 'seller_id', as: 'seller_detail' })

//order and product
db.UserProducts.hasMany(db.Orders, { foreignKey: 'product_id', as: 'order' })
db.Orders.belongsTo(db.UserProducts, { foreignKey: 'product_id', as: 'order' })

// order -- product relation
db.Checkout.hasMany(db.Orders, { foreignKey: 'c_id', as: 'order_products' })
db.Orders.belongsTo(db.Checkout, { foreignKey: 'c_id', as: 'order_products' })
// relation
db.UserProducts.hasMany(db.Orders, { foreignKey: 'product_id', as: 'product_orders' })
db.Orders.belongsTo(db.UserProducts, { foreignKey: 'product_id', as: 'product_orders' })

//comment relation
db.UserPostComment.hasMany(db.UserPostReply, { foreignKey: 'c_id', as: 'replies' })
db.UserPostReply.belongsTo(db.UserPostComment, {
    foreignKey: 'c_id',
    as: 'replies'
})

db.UserPostComment.hasMany(db.UserLikeComment, { foreignKey: 'c_id', as: 'likeComment' })
db.UserPostReply.hasMany(db.UserLikeComment, { foreignKey: 'r_id', as: 'likeReply' })

db.User.hasMany(db.UserPostComment, { foreignKey: 'u_id', as: 'commentedUser' })
db.UserPostComment.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'commentedUser'
})

db.Posts.hasMany(db.UserPostComment, { foreignKey: 'p_id', as: 'userComments' })

db.UserPostComment.belongsTo(db.Posts, {
    foreignKey: 'p_id',
    as: 'userComments'
})

db.User.hasMany(db.UserPostReply, { foreignKey: 'u_id', as: 'repliedUser' })
db.UserPostReply.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'repliedUser'
})

db.User.hasMany(db.UserLikeComment, { foreignKey: 'u_id', as: 'userLikes' })
db.UserLikeComment.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'userLikes'
})

//join event and user relation
db.User.hasMany(db.joinEvent, { foreignKey: 'u_id', as: 'joinEventUser' })
db.joinEvent.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'joinEventUser'
})

//event and join event relation
db.Events.hasMany(db.joinEvent, { foreignKey: 'event_id', as: 'joinEvent' })
db.joinEvent.belongsTo(db.Events, {
    foreignKey: 'event_id',
    as: 'joinEvent'
})

//product and chemical detail relation
db.UserProducts.hasMany(db.ChemicalDetail, { foreignKey: 'product_id', as: 'chemical_data' })
db.ChemicalDetail.belongsTo(db.UserProducts, { foreignKey: 'product_id', as: 'chemical_data' })

//chemicaldetails and chemical relation

db.Chemicals.hasMany(db.ChemicalDetail, { foreignKey: 'chemical_id', as: 'chemical_data_detail' })
db.ChemicalDetail.belongsTo(db.Chemicals, { foreignKey: 'chemical_id', as: 'chemical_data_detail' })

//user and notification relationship

db.User.hasMany(db.notification, { foreignKey: 'u_id', as: 'user_data_notification' })
db.notification.belongsTo(db.User, { foreignKey: 'u_id', as: 'user_data_notification' })
//post and notification relation
db.Posts.hasMany(db.notification, { foreignKey: 'post_id', as: 'post_data_notification' })
db.notification.belongsTo(db.Posts, { foreignKey: 'post_id', as: 'post_data_notification' })

//product and notification relation
db.UserProducts.hasMany(db.notification, { foreignKey: 'product_id', as: 'product_detail_notification' })
db.notification.belongsTo(db.UserProducts, { foreignKey: 'product_id', as: 'product_detail_notification' })

db.User.hasMany(db.UserProducts, { foreignKey: 'u_id', as: 'userProducts_details' })

db.UserProducts.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'user_detail'
})

db.User.hasMany(db.Events, { foreignKey: 'u_id', as: 'userEvents_detail' })
db.Events.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'eventUser'
})

//product fev and product relationship
db.UserProducts.hasMany(db.favorite, { foreignKey: 'product_id', as: 'fevrate_product_detail' })
db.favorite.belongsTo(db.UserProducts, { foreignKey: 'product_id', as: 'fevrate_product_detail' })

//dislike comment service
db.UserPostComment.hasMany(db.DisLikeComment, { foreignKey: 'c_id', as: 'dislikeComment' })
db.UserPostComment.hasMany(db.DisLikeComment, { foreignKey: 'r_id', as: 'dislikeReply' })

db.User.hasMany(db.DisLikeComment, { foreignKey: 'u_id', as: 'userDislikeComment' })
db.DisLikeComment.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'userDislikeComment'
})

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

export default db
