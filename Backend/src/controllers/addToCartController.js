import responseUtil from '../utilities/response.js'
import * as addToCartService from '../services/addToCartService.js'

const createCart = async (req, res) => {
    const response = await addToCartService.createCart(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.cart)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateCart = async (req, res) => {
    const response = await addToCartService.updateCart(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.cartUpdated)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteCart = async (req, res) => {
    const response = await addToCartService.deleteCart(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.postDeleted)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllCartProduct = async (req, res) => {
    const response = await addToCartService.getAllCartProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.allCarts)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {createCart, updateCart, deleteCart, getAllCartProduct}
