import responseUtil from '../utilities/response.js'
import * as eventService from '../services/eventService.js'

const createEvent = async (req, res) => {
    const response = await eventService.createEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllEvent = async (req, res) => {
    const response = await eventService.getAllEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getSingleUserEvent = async (req, res) => {
    const response = await eventService.getSingleUserEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteEvent = async (req, res) => {
    const response = await eventService.deleteEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateEvent = async (req, res) => {
    const response = await eventService.updateEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getPopularEvent = async (req, res) => {
    const response = await eventService.getPopularEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const joinEvent = async (req, res) => {
    const response = await eventService.joinEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getJoinEventDetail = async (req, res) => {
    const response = await eventService.getJoinEventDetail(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getEventById = async (req, res) => {
    const response = await eventService.getEventById(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const searchEvents = async (req, res) => {
    const response = await eventService.searchEvents(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const searchMyEvents = async (req, res) => {
    const response = await eventService.searchMyEvents(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const hideEvent = async (req, res) => {
    const response = await eventService.hideEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const unJoinEvent = async (req, res) => {
    const response = await eventService.unJoinEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const removeUserFromEvent = async (req, res) => {
    const response = await eventService.removeUserFromEvent(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export { createEvent, getAllEvent, getSingleUserEvent, deleteEvent, updateEvent, getPopularEvent, joinEvent, getJoinEventDetail, getEventById, searchEvents, searchMyEvents, hideEvent, unJoinEvent, removeUserFromEvent }
