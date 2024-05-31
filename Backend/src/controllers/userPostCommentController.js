import * as userPostCommentService from '../services/userPostCommentService.js'
import responseUtil from '../utilities/response.js'

const addUserPostComment = async (req, res) => {
    const response = await userPostCommentService.addUserPostComment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            comment: response.data.comment
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateUserPostComment = async (req, res) => {
    const response = await userPostCommentService.updateUserPostComment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteUserPostComment = async (req, res) => {
    const response = await userPostCommentService.deleteUserPostComment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewAllPostComments = async (req, res) => {
    const response = await userPostCommentService.viewAllPostComments(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            all_post_comments: response.data.allComments
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deletePostComment = async (req, res) => {
    const response = await userPostCommentService.deletePostComment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {deletePostComment, addUserPostComment, deleteUserPostComment, updateUserPostComment, viewAllPostComments}
