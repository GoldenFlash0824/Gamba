import express from 'express'
import { isSocialIdValidate, isVerificationCodeValidate, isProviderValidate, isFirstNameValidate, isUserNameValidate, isEmailValidate, isPhoneValidate, isAgeGroupValidate, isPasswordValidate, isRequestValid, isFollowerIdValidate } from '../validator/userValidation.js'
import * as userController from '../controllers/userController.js'
import { verifyAuthToken } from '../utilities/authentication.js'
import * as userPostCommentController from '../controllers/userPostCommentController.js'
import * as userPostReplyController from '../controllers/userPostReplyController.js'
import * as likeCommentController from '../controllers/likeCommentController.js'
import * as disLikeCommentController from '../controllers/disLikeCommentController.js'
import * as disLikeProfileController from '../controllers/disLikeProfileController.js'
import * as likeProfileController from '../controllers/likeProfileController.js'
import * as shareModelController from '../controllers/shareModelController.js'
import * as reportOrderController from '../controllers/reportOrderController.js'
import { isCommentIdValid, isPostIdValid } from '../validator/postValidation.js'

const router = express.Router()

router.post('/register', isEmailValidate, isPasswordValidate, isRequestValid, userController.registerUser)
router.get('/user_profile', verifyAuthToken(), userController.userMyProfile)
router.post('/update', verifyAuthToken(), userController.updateUser)
router.post('/login', isPasswordValidate, isRequestValid, userController.loginUser)
router.post('/social_login', isProviderValidate, isSocialIdValidate, isRequestValid, userController.socialLogin)
router.post('/social_update', verifyAuthToken(), isRequestValid, userController.updateSocialUser)
router.post('/send_register_code', verifyAuthToken(), isPhoneValidate, isRequestValid, userController.sendRegisterCode)
router.post('/verify_register_code', isEmailValidate, isVerificationCodeValidate, isRequestValid, userController.verfyRegisterCode)
router.post('/re_send_verification_code', userController.sendVerifictionCode)
router.post('/reset_password', isEmailValidate, isRequestValid, userController.resetPassword)
router.post('/update_password/:userId', userController.updatePassword)
router.get('/get_all_sellers', userController.getAllSellers)
router.get('/search_sellers', userController.searchSellers)
router.get('/get_user_with_max_posts', userController.getUserWMaxPosts)
router.get('/top_seller', userController.topSeller)
router.post('/update_user_password', verifyAuthToken(), userController.updateUserPassword)
router.post('/get_seller_by_id', userController.getSellerById)
router.post('/contect_us', verifyAuthToken(), userController.contectUs)
router.get('/get_contect_us', userController.getContectUs)
router.get('/user_notification', verifyAuthToken(), userController.notification)
router.get('/read_notification', verifyAuthToken(), userController.readNotification)
router.get('/mark_all_read_notification', verifyAuthToken(), userController.markAllReadnotification)

router.post('/add_post_comments', verifyAuthToken(), isPostIdValid, isRequestValid, userPostCommentController.addUserPostComment)
router.post('/update_post_comment', verifyAuthToken(), isRequestValid, userPostCommentController.updateUserPostComment)
router.post('/delete_post_comment', verifyAuthToken(), isRequestValid, userPostCommentController.deleteUserPostComment)
router.post('/view_all_post_comments', userPostCommentController.viewAllPostComments)
router.post('/post_comment_delete', verifyAuthToken(), userPostCommentController.deletePostComment)

router.post('/add_post_reply', verifyAuthToken(), isCommentIdValid, isPostIdValid, isRequestValid, userPostReplyController.addUserPostReply)
router.post('/update_post_reply', verifyAuthToken(), isRequestValid, userPostReplyController.updateUserPostReply)
router.post('/delete_post_reply', verifyAuthToken(), isRequestValid, userPostReplyController.deleteUserPostReply)
router.post('/post_reply_delete', verifyAuthToken(), userPostReplyController.deletePostReply)

router.post('/like_comment', verifyAuthToken(), isPostIdValid, isRequestValid, likeCommentController.likeComment)
router.post('/unlike_comment', verifyAuthToken(), isPostIdValid, isRequestValid, likeCommentController.unlikeComment)
router.post('/view_all_liked_comments', likeCommentController.viewAllUserLikedComments)

router.post('/disLike_comment', verifyAuthToken(), isPostIdValid, isRequestValid, disLikeCommentController.addDislikeComment)
router.post('/remove_disLike_comment', verifyAuthToken(), isPostIdValid, isRequestValid, disLikeCommentController.removeDislikeComment)
router.post('/view_all_disLiked_comments', disLikeCommentController.viewAllUserDisLikedComments)

router.post('/hide_seller', verifyAuthToken(), userController.hideSellerProfile)
router.get('/seller_order_data', verifyAuthToken(), userController.SellerOrderData)
router.post('/delete_account', verifyAuthToken(), userController.deleteUserAccount)
router.post('/notification_setting', verifyAuthToken(), userController.notificationSetting)
router.get('/get_notification_setting', verifyAuthToken(), userController.getNotificationSetting)

router.post('/add_seller_to_fev', verifyAuthToken(), userController.addSellerToFevrate)
router.get('/get_all_fev_seller', verifyAuthToken(), userController.getAllFevrateSeller)

router.post('/auto_login', verifyAuthToken(), userController.autoLogin)

router.post('/disable_account', verifyAuthToken(), userController.disableAccount)

router.post('/verify_two_fector_auth_code', isEmailValidate, isVerificationCodeValidate, isRequestValid, userController.verfyTwoFectorCode)

router.post('/enable_user_web', verifyAuthToken(), userController.enableAccount)
router.post('/privacy_setting', verifyAuthToken(), userController.userPrivacySetting)
router.get('/get_user_privacy_setting', verifyAuthToken(), userController.getuserPrivacySetting)
// router.post('/search_by_name', verifyAuthToken(), userController.searchByName)
// router.post('/update_notification', verifyAuthToken(), userNotificationController.updateUserNotification)
// router.post('/send_fcm', verifyAuthToken(), userController.sendChatFcm)
// router.get('/notifications', verifyAuthToken(), userController.getAllNotification)
// router.get('/profile', verifyAuthToken(), userController.getUserById)
// router.delete('/delete_user', verifyAuthToken(), userController.deleteUserAllData)

//add user profile likes
router.post('/like_user', verifyAuthToken(), likeProfileController.addlikeUser)
router.post('/remove_like_user', verifyAuthToken(), likeProfileController.removelikeProfile)
router.post('/view_all_liked_users', verifyAuthToken(), likeProfileController.viewAllUserLikedProfiles)

//add user profile dislike
router.post('/dislike_user', verifyAuthToken(), disLikeProfileController.addDislikeUser)
router.post('/remove_dislike_user', verifyAuthToken(), disLikeProfileController.removeDislikeProfile)
router.post('/view_all_disliked_users', verifyAuthToken(), disLikeProfileController.viewAllUserDisLikedProfiles)

router.post('/connect_trade_product', verifyAuthToken(), userController.connectTradeProduct);
router.post('/connect_giveaway_product', verifyAuthToken(), userController.connectGiveAwayProduct)
router.post('/contact_us', verifyAuthToken(), userController.contactWithUs)

//share post/event/product
router.post('/share_post', verifyAuthToken(), shareModelController.addShare)
router.post('/view_all_shared_users', verifyAuthToken(), shareModelController.viewAllUserShared)

//order report
router.post('/add_order_report', verifyAuthToken(), reportOrderController.addReport)
router.post('/get_order_report', verifyAuthToken(), reportOrderController.getOrderAllReports)

router.get('/block_users', userController.allBlockUsers)

export { router }
