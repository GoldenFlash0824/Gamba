import * as likeUserProfileService from '../services/likeUserProfileService.js'
import responseUtil from '../utilities/response.js'

const addlikeUser = async (req, res) => {
    const response = await likeUserProfileService.addlikeUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const removelikeProfile = async (req, res) => {
    const response = await likeUserProfileService.removelikeProfile(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {data: response.data})
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewAllUserLikedProfiles = async (req, res) => {
    const response = await likeUserProfileService.viewAllUserLikedProfiles(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {addlikeUser, removelikeProfile, viewAllUserLikedProfiles}
