import * as likeCommentService from '../services/likeCommentService.js'
import responseUtil from '../utilities/response.js'

const likeComment = async (req, res) => {
    const response = await likeCommentService.likeComment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            like_comments: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const unlikeComment = async (req, res) => {
    const response = await likeCommentService.unlikeComment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            like_comments: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewAllUserLikedComments = async (req, res) => {
    const response = await likeCommentService.viewAllUserLikedComments(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            data: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {likeComment, unlikeComment, viewAllUserLikedComments}
