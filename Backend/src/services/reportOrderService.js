import db from '../models/index.js'
import { getUserIdFromToken } from '../utilities/authentication.js'
import { facetStage } from './userService.js'

const addReport = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { order_id, reason } = req.body
        let reported = []
        if (order_id?.length) {
            for (let i = 0; i < order_id?.length; i++) {
                let _reported = await db.OrderReport.findOne({ where: { u_id: u_id, order_id: order_id[i]?.id } })
                if (!_reported) {
                    let report = await db.OrderReport.create({ u_id: u_id, order_id: order_id[i]?.id, reason: reason })
                    if (report) {
                        reported.push(report)
                    }

                }
            }

            if (reported?.length) {
                return {
                    status: true,
                    message: 'Order report submitted',
                    data: reported
                }
            } else {

                return {
                    status: false,
                    message: 'already reported'
                }
            }

        }
        return {
            status: false,
            message: 'already reported'
        }

    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteReporte = async (req) => {
    try {
        const { id } = req.body
        if (id) {
            await db.OrderReport.destroy({ where: { id: id } })
            return {
                status: true,
                message: 'Report deleted successfully'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getOrderAllReports = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { order_id } = req.body
        let _reported = await db.OrderReport.findAll({ where: { order_id: order_id }, include: [{ association: 'reportedUser', attributes: ['id', 'first_name', 'last_name', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format'] }, { association: 'bokingOrder' }] })
        return {
            status: true,
            message: 'order reports',
            data: _reported
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getAllOrdersReports = async (req) => {
    const { limit, offset } = await facetStage(req.query.page)

    let _reported = await db.OrderReport.findAll({ attributes: ['order_id'], raw: true })
    _reported = _reported.map((re) => re.order_id)

    const response = await db.Orders.findAndCountAll({
        where: { id: { [db.Op.in]: _reported } },
        order: [['createdAt', 'DESC']],
        include: [
            {
                association: 'seller_detail',
                attributes: ['id', 'first_name', 'last_name', 'email', 'image', 'is_block_payment', 'phone', 'is_block']
            },
            { association: 'bokingOrder', include: [{ association: 'reportedUser', attributes: ['id', 'first_name', 'last_name', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format'] }] }
        ],
        offset: offset,
        limit: limit
    })

    const remainingCount = response?.count - (offset + response?.rows?.length)

    if (response) {
        return {
            data: { response: response?.rows, page: req.query.page, remaining: remainingCount },
            status: true,
            message: `Get order reports successfully `
        }
    } else {
        return {
            status: false,
            message: `error`
        }
    }
}

export { addReport, deleteReporte, getAllOrdersReports, getOrderAllReports }
