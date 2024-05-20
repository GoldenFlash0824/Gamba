import responseUtil from '../utilities/response.js'
import * as postService from '../services/userPostService.js'

const createPost = async (req, res) => {
    const response = await postService.createPost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.createdPost)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updatePost = async (req, res) => {
    const response = await postService.updatePost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.post)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

// developed by smart-soft-studios
const deletePost = async (req, res) => {
    const response = await postService.deletePost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.postDeleted)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewAllPosts = async (req, res) => {
    const response = await postService.viewAllPosts(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewAllUserPosts = async (req, res) => {
    const response = await postService.viewAllUserPosts(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.viewAllPosts)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewSingleUserPosts = async (req, res) => {
    const response = await postService.viewSingleUserPosts(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.viewAllPosts)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const addPostLike = async (req, res) => {
    const response = await postService.addPostLike(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.likes)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const unLikePost = async (req, res) => {
    const response = await postService.unLikePost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const addPostComment = async (req, res) => {
    const response = await postService.addPostComment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.commentCreated)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const searchPosts = async (req, res) => {
    const response = await postService.searchPosts(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.searchPosts)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const popularPost = async (req, res) => {
    const response = await postService.popularPost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const viewPostById = async (req, res) => {
    const response = await postService.viewPostById(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const hidePost = async (req, res) => {
    const response = await postService.hidePost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllPostLikes = async (req, res) => {
    const response = await postService.getAllPostLikes(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const sideBarCount = async (req, res) => {
    const response = await postService.sideBarCount(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getSellerAllPost = async (req, res) => {
    const response = await postService.getSellerAllPost(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export { createPost, updatePost, deletePost, viewAllPosts, viewAllUserPosts, addPostLike, addPostComment, viewSingleUserPosts, searchPosts, popularPost, unLikePost, viewPostById, hidePost, getAllPostLikes, sideBarCount, getSellerAllPost }
