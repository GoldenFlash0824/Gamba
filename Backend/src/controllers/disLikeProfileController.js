import * as dislikeUserProfileService from '../services/dislikeUserProfileService.js'
import responseUtil from '../utilities/response.js'

const addDislikeUser = async (req, res) => {
    const response = await dislikeUserProfileService.addDislikeUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const removeDislikeProfile = async (req, res) => {
    const response = await dislikeUserProfileService.removeDislikeProfile(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {data: response.data})
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewAllUserDisLikedProfiles = async (req, res) => {
    const response = await dislikeUserProfileService.viewAllUserDisLikedProfiles(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {addDislikeUser, removeDislikeProfile, viewAllUserDisLikedProfiles}
