import * as notificationService from '../services/userNotificationService.js'
import responseUtil from '../utilities/response.js'

const updateUserNotification = async (req, res) => {
    const response = await notificationService.updateUserNotification(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {data: response.data.userNotifcation})
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewUserNotification = async (req, res) => {
    const response = await notificationService.viewUserNotification(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {data: response.data.userNotification})
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {updateUserNotification, viewUserNotification}
