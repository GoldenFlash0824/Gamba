import * as dislikeCommentService from '../services/dislikeCommentService.js'
import responseUtil from '../utilities/response.js'

const addDislikeComment = async (req, res) => {
    const response = await dislikeCommentService.addDislikeComment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const removeDislikeComment = async (req, res) => {
    const response = await dislikeCommentService.removeDislikeComment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {data: response.data})
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewAllUserDisLikedComments = async (req, res) => {
    const response = await dislikeCommentService.viewAllUserDisLikedComments(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {addDislikeComment, removeDislikeComment, viewAllUserDisLikedComments}
