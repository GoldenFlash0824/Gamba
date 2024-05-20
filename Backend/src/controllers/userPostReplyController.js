import * as userPostReplyService from '../services/userPostReplyService.js'
import responseUtil from '../utilities/response.js'

const addUserPostReply = async (req, res) => {
    const response = await userPostReplyService.addUserPostReply(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            reply: response.data.comment
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateUserPostReply = async (req, res) => {
    const response = await userPostReplyService.updateUserPostReply(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteUserPostReply = async (req, res) => {
    const response = await userPostReplyService.deleteUserPostReply(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deletePostReply = async (req, res) => {
    const response = await userPostReplyService.deletePostReply(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {deletePostReply, addUserPostReply, deleteUserPostReply, updateUserPostReply}
