import responseUtil from '../utilities/response.js'
import * as checkoutService from '../services/checkoutService.js'

const createCheckout = async (req, res) => {
    const response = await checkoutService.createCheckout(req)

    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.checkout)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const processCashOnDelivery = async (req, res) => {
    const response = await checkoutService.processCashOnDelivery(req)

    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.checkout)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateCheckout = async (req, res) => {
    const response = await checkoutService.updateCheckout(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.checkoutUpdated)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getOrders = async (req, res) => {
    const response = await checkoutService.getOrders(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.orders)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const makePayment = async (req, res) => {
    const response = await checkoutService.makePayment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const processPayment = async (req, res) => {
    const response = await checkoutService.processPayment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const connectStripe = async (req, res) => {
    const response = await checkoutService.connectToStripe(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const isMerchantConnected = async (req, res) => {
    const response = await checkoutService.isMerchantConnected(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const retriveAccount = async (req, res) => {
    const response = await checkoutService.retriveAccount(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const removeAccount = async (req, res) => {
    const response = await checkoutService.removeConnectedAccount(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}


const addCard = async (req, res) => {
    const response = await checkoutService.addCard(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const myCards = async (req, res) => {
    const response = await checkoutService.myCards(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const changDefaultPayment = async (req, res) => {
    const response = await checkoutService.changDefaultPayment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteCard = async (req, res) => {
    const response = await checkoutService.deleteCard(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const initializToPayment = async (req, res) => {
    const response = await checkoutService.initializPayment(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export { 
    createCheckout, updateCheckout, getOrders, makePayment, connectStripe, retriveAccount, removeAccount, addCard, myCards, changDefaultPayment, 
    deleteCard, processPayment, isMerchantConnected, initializToPayment, processCashOnDelivery
}
