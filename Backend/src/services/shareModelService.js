import db from '../models/index.js'
import {getUserIdFromToken} from '../utilities/authentication.js'

import {facetStage} from './userService.js'

const addShare = async (req) => {
    try {
        const {post_id, product_id, event_id} = req.body
        const u_id = await getUserIdFromToken(req)

        const _findShare = await db.SharePost.findOne({where: {u_id: u_id, [db.Op.or]: [post_id ? {post_id: post_id} : product_id ? {product_id: product_id} : {event_id: event_id}]}})
        if (_findShare) {
            return {
                status: false,
                message: 'already shared'
            }
        }
        const _create = await db.SharePost.create({u_id: u_id, post_id: post_id, product_id: product_id, event_id: event_id})
        if (_create) {
            const createdShare = await db.SharePost.findOne({where: {id: _create?.id}, attributes: [product_id ? [db.sequelize.fn('COUNT', db.sequelize.col('product_id', product_id)), 'totalShared'] : event_id ? [db.sequelize.fn('COUNT', db.sequelize.col('event_id', event_id)), 'total'] : [db.sequelize.fn('COUNT', db.sequelize.col('post_id', post_id)), 'total']]})
            return {
                status: true,
                message: 'Shared successfull',
                data: createdShare
            }
        }
        return {
            status: false,
            message: 'Something went wrong. Please try again later.'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const viewAllUserShared = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {limit, offset} = await facetStage(req.body.page)
        const {post_id, product_id, event_id} = req.body
        let totalUsers = await db.SharePost.findAll({limit: limit, offset: offset, where: {[db.Op.or]: [post_id ? {post_id: post_id} : product_id ? {product_id: product_id} : {event_id: event_id}]}, include: [{association: 'shareUser', attributes: ['id', 'first_name', 'last_name', 'image']}]})
        return {
            status: true,
            message: 'all shared users',
            data: totalUsers
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

export {viewAllUserShared, addShare}
