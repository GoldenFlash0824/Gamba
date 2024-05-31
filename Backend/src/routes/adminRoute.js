import express from 'express'
import * as adminController from '../controllers/adminController.js'
import * as userController from '../controllers/userController.js'
import * as productController from '../controllers/productController.js'
import { verifyAuthToken, verifyAdminAuthToken } from '../utilities/authentication.js'
import * as eventController from '../controllers/eventController.js'
import * as reportOrderController from '../controllers/reportOrderController.js'

const router = express.Router()

router.post('/login', adminController.adminLogin)
router.post('/forgot-password', adminController.adminPasswordResetRequest)
router.post('/reset-password/:token', adminController.adminPasswordUpdate)

router.get('/transfer_details', verifyAuthToken(), adminController.stripeTransferDetails)

router.get('/profile', verifyAdminAuthToken(), adminController.getAdminProfile)
router.post('/update-profile', verifyAdminAuthToken(), adminController.updateAdminProfile)

router.get('/view_stats', verifyAdminAuthToken(), adminController.viewStats)

router.get('/view_all_user', verifyAdminAuthToken(), userController.viewAllUser)
router.get('/view_all_deleted_user', verifyAdminAuthToken(), adminController.getDeletedUser)
router.post('/view_user', verifyAdminAuthToken(), userController.viewUser)
//router.delete('/delete_user/:id', verifyAdminAuthToken(), userController.deleteUser)

router.post('/user_profile', verifyAdminAuthToken(), adminController.userProfileUpdated)

router.post('/update_user', verifyAdminAuthToken(), adminController.updateUser)

router.get('/export_all_users', verifyAdminAuthToken(), adminController.exportAllUsers)

router.post('/block_user', verifyAdminAuthToken(), adminController.blockUser)
router.post('/unblock_user', verifyAdminAuthToken(), adminController.unblockUser)
router.get('/all_block_user', verifyAdminAuthToken(), adminController.getblockUser)

router.post('/add_category', verifyAdminAuthToken(), productController.addCategory)
router.post('/add_chemical', verifyAdminAuthToken(), productController.addChemical)
router.post('/update_category/:id', verifyAdminAuthToken(), productController.updateCategory)
router.delete('/delete_category/:id/:isEnable', verifyAdminAuthToken(), productController.deleteCategory)
router.post('/category_search', verifyAdminAuthToken(), productController.getCategorySearch)

router.get('/get_all_chemical_data', productController.getChemical)
router.post('/update_chemical/:id', verifyAdminAuthToken(), productController.updateChemical)
router.delete('/delete_chemical/:id', verifyAdminAuthToken(), productController.deleteChemical)
router.post('/chemical_search', verifyAdminAuthToken(), productController.getChemicalSearch)

router.post('/reported_product', verifyAuthToken(), adminController.reportedProduct)

router.get('/get_all_reported_product', verifyAdminAuthToken(), adminController.getreportedProduct)
router.post('/get_all_reported_product_search', verifyAdminAuthToken(), adminController.getreportedProductSearch)
router.delete('/delete_product/:id/:product_id', verifyAdminAuthToken(), adminController.deleteReportedProduct)
router.post('/update_reported_product', verifyAdminAuthToken(), adminController.updateReportedProduct)
router.post('/get_all_block_product_search', verifyAdminAuthToken(), adminController.getBlockproductSearch)
router.delete('/delete_event/:id', verifyAdminAuthToken(), adminController.deleteEvent)
router.delete('/delete_post/:id', verifyAdminAuthToken(), adminController.deletePost)

router.post('/reported_event', verifyAuthToken(), adminController.reportedEvent)
router.get('/get_all_reported_event', verifyAdminAuthToken(), adminController.getreportedEvent)
router.delete('/delete_reported_Event/:id/:event_id', verifyAdminAuthToken(), adminController.deleteReportedEvent)
router.post('/get_all_reported_event_search', verifyAdminAuthToken(), adminController.getreportedEventSearch)
router.post('/update_reported_event_data', verifyAdminAuthToken(), adminController.updatereportedEvent)
router.post('/get_all_reported_block_event_search', verifyAdminAuthToken(), adminController.getreportedBlockEventSearch)

router.post('/reported_post', verifyAuthToken(), adminController.reportedPost)
router.get('/get_all_reported_Post', verifyAdminAuthToken(), adminController.getreportedPost)
router.delete('/delete_reported_post/:id/:post_id', verifyAdminAuthToken(), adminController.deleteReportedPost)
router.post('/get_all_reported_post_search', verifyAdminAuthToken(), adminController.getreportedPostSearch)
router.post('/get_all_reported_block_post_search', verifyAdminAuthToken(), adminController.getreportedBlockPostSearch)
router.post('/update_reported_post', verifyAdminAuthToken(), adminController.updateReportedPost)

router.post('/add_notes', verifyAuthToken(), adminController.addNotes)
router.get('/get_order_notes/:id', verifyAdminAuthToken(), adminController.getOrderNotes)

router.post('/get_search_user', verifyAdminAuthToken(), adminController.userSearch)
router.delete('/delete_user/:id', verifyAdminAuthToken(), adminController.deleteUser)

router.get('/get_all_orders', verifyAdminAuthToken(), adminController.getAllOrders)
router.post('/get_all_orders_search', verifyAdminAuthToken(), adminController.allOrderSearch)

router.post('/block_post', verifyAdminAuthToken(), adminController.blockPost)
router.post('/block_event', verifyAdminAuthToken(), adminController.blockEvent)
router.post('/block_product', verifyAdminAuthToken(), adminController.blockProduct)

router.post('/unblock_post', verifyAdminAuthToken(), adminController.unblockPost)
router.post('/unblock_event', verifyAdminAuthToken(), adminController.unblockEvent)
router.post('/unblock_product', verifyAdminAuthToken(), adminController.unblockProduct)

router.get('/all_block_post', verifyAdminAuthToken(), adminController.getAllBlockPost)
router.get('/all_block_event', verifyAdminAuthToken(), adminController.getBlockEvent)
router.get('/all_block_Product', verifyAdminAuthToken(), adminController.getAllBlockProduct)

router.post('/manage_order', verifyAdminAuthToken(), adminController.ManageOrder)
router.get('/manage_paid_order/:page?', verifyAdminAuthToken(), adminController.ManagePaidOrder)
router.get('/search_paid_order', verifyAdminAuthToken(), adminController.searchPaidOrder)
router.get('/cancel_order/:id', verifyAdminAuthToken(), adminController.cancelOrder)
router.post('/manage_cancelled_order/:page?', verifyAdminAuthToken(), adminController.ManageCancelledOrder)

router.post('/seller_history', verifyAdminAuthToken(), adminController.SellerHistory)
router.post('/seller_total', verifyAdminAuthToken(), adminController.SellerTotal)
router.post('/block_user_for_payment', verifyAdminAuthToken(), adminController.blockUserForPayment)
router.get('/view_all_disputed_user', verifyAdminAuthToken(), adminController.ViewAllDisputedUser)
router.post('/remove_user_from_event', verifyAdminAuthToken(), adminController.removeUserFromEvent)

router.post('/disable_user_account_admin', verifyAdminAuthToken(), userController.disableAccount)
router.get('/get_all_disable_user', verifyAdminAuthToken(), userController.getAllDisableAccount)
router.post('/enable_user', verifyAdminAuthToken(), userController.enableAccount)

router.post('/import_chemical', verifyAdminAuthToken(), productController.importChemical)

router.post('/manage_unpaid', verifyAdminAuthToken(), adminController.unPaidOrder)
router.post('/charge_seller', verifyAdminAuthToken(), adminController.chargeSeller)
router.get('/gamba_payment_history/:page?', verifyAdminAuthToken(), adminController.paymentHistoryGamba)

router.get('/all_order_reports', verifyAdminAuthToken(), reportOrderController.getAllOrdersReports)
router.post('/delete_order_report', verifyAdminAuthToken(), reportOrderController.deleteReport)

router.post('/block_user_search', verifyAdminAuthToken(), adminController.userSearchBlock)
router.post('/disable_user_search', verifyAdminAuthToken(), adminController.userSearchDisable)

router.get('/get_all_events', verifyAdminAuthToken(), adminController.getAllEvents)
router.get('/search_event', verifyAdminAuthToken(), adminController.searchAllEvents)

router.get('/get_all_products', verifyAdminAuthToken(), adminController.getAllProducts)
router.get('/search_products', verifyAdminAuthToken(), adminController.searchAllProducts)
router.delete('/delete_product_good/:id', verifyAdminAuthToken(), adminController.deleteProduct)

router.get('/get_all_posts', verifyAdminAuthToken(), adminController.getAllPosts)
router.get('/search_posts', verifyAdminAuthToken(), adminController.searchAllPosts)
export { router }
