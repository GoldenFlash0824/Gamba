import * as reportOrderService from '../services/reportOrderService.js'
import responseUtil from '../utilities/response.js'

const addReport = async (req, res) => {
    const response = await reportOrderService.addReport(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteReport = async (req, res) => {
    const response = await reportOrderService.deleteReporte(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getOrderAllReports = async (req, res) => {
    const response = await reportOrderService.getOrderAllReports(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllOrdersReports = async (req, res) => {
    const response = await reportOrderService.getAllOrdersReports(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export { getAllOrdersReports, getOrderAllReports, addReport, deleteReport }
