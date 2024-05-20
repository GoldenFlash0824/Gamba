import * as adminService from '../services/adminService.js'
import responseUtil from '../utilities/response.js'

const adminLogin = async (req, res) => {
    const response = await adminService.adminLogin(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            admin_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const adminPasswordResetRequest = async (req, res) => {
    const response = await adminService.resetPassword(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const adminPasswordUpdate = async (req, res) => {
    const response = await adminService.updateAdminPassword(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const stripeTransferDetails = async (req, res) => {
    const response = await adminService.stripeTransferDetails(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAdminProfile = async (req, res) => {
    const response = await adminService.getAdminProfile(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            admin_details: response.data.admin
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateAdminProfile = async (req, res) => {
    const response = await adminService.updateAdminProfile(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            admin_details: response.data.admin
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewStats = async (req, res) => {
    const response = await adminService.viewStats(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const userProfileUpdated = async (req, res) => {
    const response = await adminService.userProfileUpdated(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateUser = async (req, res) => {
    const response = await adminService.updateUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

//All users for excel sheet
const exportAllUsers = async (req, res) => {
    const response = await adminService.exportAllUsers(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            all_users: response.data.all_users
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const blockReportedUser = async (req, res) => {
    const response = await adminService.blockReportedUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const unBlockUser = async (req, res) => {
    const response = await adminService.unBlockUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const reportedProduct = async (req, res) => {
    const response = await adminService.reportedProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getreportedProduct = async (req, res) => {
    const response = await adminService.getreportedProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getreportedProductSearch = async (req, res) => {
    const response = await adminService.getreportedProductSearch(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getBlockproductSearch = async (req, res) => {
    const response = await adminService.getBlockproductSearch(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteReportedProduct = async (req, res) => {
    const response = await adminService.deleteReportedProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateReportedProduct = async (req, res) => {
    const response = await adminService.updateReportedProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteEvent = async (req, res) => {
    const response = await adminService.deleteEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deletePost = async (req, res) => {
    const response = await adminService.deletePost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateReportedPost = async (req, res) => {
    const response = await adminService.updateReportedPost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const reportedEvent = async (req, res) => {
    const response = await adminService.reportedEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const addNotes = async (req, res) => {
    const response = await adminService.addNotes(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getreportedEvent = async (req, res) => {
    const response = await adminService.getreportedEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteReportedEvent = async (req, res) => {
    const response = await adminService.deleteReportedEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getreportedEventSearch = async (req, res) => {
    const response = await adminService.getreportedEventSearch(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getreportedBlockEventSearch = async (req, res) => {
    const response = await adminService.getreportedBlockEventSearch(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const reportedPost = async (req, res) => {
    const response = await adminService.reportedPost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getreportedPost = async (req, res) => {
    const response = await adminService.getreportedPost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getOrderNotes = async (req, res) => {
    const response = await adminService.getOrderNotes(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteReportedPost = async (req, res) => {
    const response = await adminService.deleteReportedPost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getreportedPostSearch = async (req, res) => {
    const response = await adminService.getreportedPostSearch(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getreportedBlockPostSearch = async (req, res) => {
    const response = await adminService.getreportedBlockPostSearch(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const userSearch = async (req, res) => {
    const response = await adminService.userSearch(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteUser = async (req, res) => {
    const response = await adminService.deleteUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllOrders = async (req, res) => {
    const response = await adminService.getAllOrders(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const allOrderSearch = async (req, res) => {
    const response = await adminService.allOrderSearch(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const blockPost = async (req, res) => {
    const response = await adminService.blockPost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const blockEvent = async (req, res) => {
    const response = await adminService.blockEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const blockProduct = async (req, res) => {
    const response = await adminService.blockProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const unblockPost = async (req, res) => {
    const response = await adminService.unblockPost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const unblockEvent = async (req, res) => {
    const response = await adminService.unblockEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const unblockProduct = async (req, res) => {
    const response = await adminService.unblockProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllBlockPost = async (req, res) => {
    const response = await adminService.getAllBlockPost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getBlockEvent = async (req, res) => {
    const response = await adminService.getBlockEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllBlockProduct = async (req, res) => {
    const response = await adminService.getAllBlockProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const blockUser = async (req, res) => {
    const response = await adminService.blockUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const unblockUser = async (req, res) => {
    const response = await adminService.unblockUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getblockUser = async (req, res) => {
    const response = await adminService.getblockUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getDeletedUser = async (req, res) => {
    const response = await adminService.getDeletedUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}


const updatereportedEvent = async (req, res) => {
    const response = await adminService.updatereportedEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const ManageOrder = async (req, res) => {
    const response = await adminService.ManageOrder(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const ManagePaidOrder = async (req, res) => {
    const response = await adminService.ManagePaidOrder(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const ManageCancelledOrder = async (req, res) => {
    const response = await adminService.ManageCancelledOrder(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const cancelOrder = async (req, res) => {
    const response = await adminService.cancelOrder(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const unPaidOrder = async (req, res) => {
    const response = await adminService.unPaidOrder(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const SellerHistory = async (req, res) => {
    const response = await adminService.SellerHistory(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const chargeSeller = async (req, res) => {
    const response = await adminService.chargeSeller(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const paymentHistoryGamba = async (req, res) => {
    const response = await adminService.paymentHistoryGamba(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const SellerTotal = async (req, res) => {
    const response = await adminService.SellerTotal(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const blockUserForPayment = async (req, res) => {
    const response = await adminService.blockUserForPayment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const ViewAllDisputedUser = async (req, res) => {
    const response = await adminService.ViewAllDisputedUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const removeUserFromEvent = async (req, res) => {
    const response = await adminService.removeUserFromEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const userSearchBlock = async (req, res) => {
    const response = await adminService.userSearchBlock(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const userSearchDisable = async (req, res) => {
    const response = await adminService.userSearchDisable(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}


const getAllProducts = async (req, res) => {
    const response = await adminService.getAllProductGood(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const searchAllProducts = async (req, res) => {
    const response = await adminService.searchProductGood(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}


const getAllPosts = async (req, res) => {
    const response = await adminService.viewAllPosts(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const searchAllPosts = async (req, res) => {
    const response = await adminService.searchPosts(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllEvents = async (req, res) => {
    const response = await adminService.getAllEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const searchAllEvents = async (req, res) => {
    const response = await adminService.searchAllEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}


const deleteProduct = async (req, res) => {
    const response = await adminService.deleteProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {
    adminPasswordUpdate, adminPasswordResetRequest, getDeletedUser, updateAdminProfile, getAdminProfile, deleteProduct,
    searchAllPosts, getAllPosts, getAllProducts, searchAllProducts, searchAllEvents, getAllEvents, adminLogin, viewStats,
    userProfileUpdated, updateUser, exportAllUsers, blockReportedUser, unBlockUser, reportedProduct, getreportedProduct,
    getreportedProductSearch, deleteReportedProduct, updateReportedProduct, deleteEvent, deletePost, reportedEvent, getreportedEvent,
    deleteReportedEvent, getreportedEventSearch, reportedPost, getreportedPost, deleteReportedPost, getreportedPostSearch, userSearch,
    deleteUser, getAllOrders, allOrderSearch, blockPost, blockEvent, blockProduct, unblockPost, unblockEvent, unblockProduct, getAllBlockPost,
    getBlockEvent, getAllBlockProduct, blockUser, unblockUser, getblockUser, updatereportedEvent, getreportedBlockPostSearch, getreportedBlockEventSearch,
    getBlockproductSearch, updateReportedPost, ManageOrder, SellerHistory, SellerTotal, blockUserForPayment, ViewAllDisputedUser, removeUserFromEvent, unPaidOrder, chargeSeller,
    paymentHistoryGamba, userSearchBlock, userSearchDisable, stripeTransferDetails, ManagePaidOrder, addNotes, getOrderNotes, cancelOrder, ManageCancelledOrder
}
