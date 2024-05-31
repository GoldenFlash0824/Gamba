import * as shareModelService from '../services/shareModelService.js'
import responseUtil from '../utilities/response.js'

const addShare = async (req, res) => {
    const response = await shareModelService.addShare(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const viewAllUserShared = async (req, res) => {
    const response = await shareModelService.viewAllUserShared(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {addShare, viewAllUserShared}
