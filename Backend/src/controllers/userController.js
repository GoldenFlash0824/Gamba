import * as userService from '../services/userService.js'
import responseUtil from '../utilities/response.js'

const registerUser = async (req, res) => {
    const response = await userService.registerUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const userMyProfile = async (req, res) => {
    const response = await userService.userProfile(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.info)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateUser = async (req, res) => {
    const response = await userService.updateUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.updatedUser)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateSocialUser = async (req, res) => {
    const response = await userService.updateSocialUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const loginUser = async (req, res) => {
    const response = await userService.loginUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user: response.data.user,
            chemicalData: response.data.chemicalData,
            categoryData: response.data.categoryData,
            is_verified: response.data.is_verified
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message, {})
    }
}

const autoLogin = async (req, res) => {
    const response = await userService.autoLogin(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewAllUser = async (req, res) => {
    const response = await userService.viewAllUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            all_users: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewUser = async (req, res) => {
    const response = await userService.viewUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteUser = async (req, res) => {
    const response = await userService.deleteUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const socialLogin = async (req, res) => {
    const response = await userService.socialLogin(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user: response.data.user,
            isNewUser: response.data.isNewUser
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const sendRegisterCode = async (req, res) => {
    const response = await userService.sendRegisterCode(req)
    if (response) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const verfyRegisterCode = async (req, res) => {
    const response = await userService.verfyRegisterCode(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const sendVerifictionCode = async (req, res) => {
    const response = await userService.sendVerificationCode(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const resetPassword = async (req, res) => {
    const response = await userService.resetPassword(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updatePassword = async (req, res) => {
    const response = await userService.updatePassword(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewUserAllContacts = async (req, res) => {
    const response = await userService.viewUserAllContacts(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            all_user_contacts: response.data.myContacts
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const searchByName = async (req, res) => {
    const response = await userService.searchByName(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            search_by_name: response.data.users
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllNotification = async (req, res) => {
    const response = await userService.getAllNotification(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, { notifications: response.data.notifications })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const sendChatFcm = async (req, res) => {
    const response = await userService.sendChatFcm(req)
    return res.send(response)
}

const deleteUserAllData = async (req, res) => {
    const response = await userService.deleteUserAllData(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getUserById = async (req, res) => {
    const response = await userService.getUserById(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllSellers = async (req, res) => {
    const response = await userService.getAllSellers(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const searchSellers = async (req, res) => {
    const response = await userService.searchSellers(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getUserWMaxPosts = async (req, res) => {
    const response = await userService.getUserWMaxPosts(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const topSeller = async (req, res) => {
    const response = await userService.topSeller(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const updateUserPassword = async (req, res) => {
    const response = await userService.updateUserPassword(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getSellerById = async (req, res) => {
    const response = await userService.getSellerById(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const contectUs = async (req, res) => {
    const response = await userService.contectUs(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getContectUs = async (req, res) => {
    const response = await userService.getContectUs(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const notification = async (req, res) => {
    const response = await userService.notification(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const readNotification = async (req, res) => {
    const response = await userService.readNotification(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const hideSellerProfile = async (req, res) => {
    const response = await userService.hideSellerProfile(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const SellerOrderData = async (req, res) => {
    const response = await userService.SellerOrderData(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const deleteUserAccount = async (req, res) => {
    const response = await userService.deleteUserAccount(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const notificationSetting = async (req, res) => {
    const response = await userService.notificationSetting(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getNotificationSetting = async (req, res) => {
    const response = await userService.getNotificationSetting(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const addSellerToFevrate = async (req, res) => {
    const response = await userService.addSellerToFevrate(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getAllFevrateSeller = async (req, res) => {
    const response = await userService.getAllFevrateSeller(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const disableAccount = async (req, res) => {
    const response = await userService.disableAccount(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getAllDisableAccount = async (req, res) => {
    const response = await userService.getAllDisableAccount(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const enableAccount = async (req, res) => {
    const response = await userService.enableAccount(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const verfyTwoFectorCode = async (req, res) => {
    const response = await userService.verfyTwoFectorCode(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.popUp)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const userPrivacySetting = async (req, res) => {
    const response = await userService.userPrivacySetting(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getuserPrivacySetting = async (req, res) => {
    const response = await userService.getuserPrivacySetting(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const markAllReadnotification = async (req, res) => {
    const response = await userService.markAllReadnotification(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const connectTradeProduct = async (req, res) => {
    const response = await userService.connectTradeProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const connectGiveAwayProduct = async (req, res) => {
    const response = await userService.connectGiveAwayProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const contactWithUs = async (req, res) => {
    const response = await userService.contactWithUs(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const allBlockUsers = async (req, res) => {
    const response = await userService.getAllBlockUsers(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export { allBlockUsers, deleteUserAllData, contactWithUs, connectTradeProduct, connectGiveAwayProduct, userMyProfile, sendChatFcm, getAllNotification, registerUser, updateUser, loginUser, autoLogin, viewAllUser, deleteUser, socialLogin, sendVerifictionCode, sendRegisterCode, verfyRegisterCode, resetPassword, updatePassword, viewUser, viewUserAllContacts, searchByName, updateSocialUser, getUserById, getAllSellers, searchSellers, getUserWMaxPosts, topSeller, updateUserPassword, getSellerById, contectUs, getContectUs, notification, hideSellerProfile, SellerOrderData, deleteUserAccount, notificationSetting, getNotificationSetting, addSellerToFevrate, getAllFevrateSeller, disableAccount, getAllDisableAccount, enableAccount, verfyTwoFectorCode, userPrivacySetting, getuserPrivacySetting, markAllReadnotification, readNotification }
