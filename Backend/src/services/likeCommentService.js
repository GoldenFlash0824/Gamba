import db from '../models/index.js'
import {getUserIdFromToken} from '../utilities/authentication.js'

import {facetStage} from './userService.js'

const likeComment = async (req) => {
    try {
        const {c_id, r_id} = req.body
        const u_id = await getUserIdFromToken(req)

        const findComment = c_id ? await db.UserPostComment.findOne({where: {id: c_id}}) : await db.UserPostReply.findOne({where: {id: r_id}})
        if (findComment) {
            const _likeComment = await db.UserLikeComment.findOne({where: {u_id: u_id, [db.Op.or]: [c_id ? {c_id: c_id} : {r_id: r_id}]}})
            if (_likeComment) {
                return {
                    status: false,
                    message: 'Comment already liked'
                }
            }
            const addLike = await db.UserLikeComment.create({u_id: u_id, u_id, c_id: c_id, r_id: r_id})
            if (addLike) {
                const createLike = await db.UserLikeComment.findOne({where: {id: addLike?.id}, attributes: [c_id ? [db.sequelize.fn('COUNT', db.sequelize.col('c_id', c_id)), 'likeCount'] : [db.sequelize.fn('COUNT', db.sequelize.col('r_id', r_id)), 'likeCount']]})
                return {
                    status: true,
                    message: 'Added to liked comment',
                    data: {addLike: createLike}
                }
            }
            return {
                status: false,
                message: 'Something went wrong. Please try again later.'
            }
        }
        return {
            status: false,
            message: 'Comment not found.'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const unlikeComment = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {c_id, r_id, p_id} = req.body
        const likeComment = await db.UserLikeComment.findOne({where: {u_id: u_id, [db.Op.or]: [c_id ? {c_id: c_id} : {r_id: r_id}]}})
        const post = await db.Posts.findOne({where: {id: p_id}})
        if (likeComment) {
            await db.UserLikeComment.destroy({where: {u_id: u_id, [db.Op.or]: [c_id ? {c_id: c_id} : {r_id: r_id}]}})
            const likeCount = c_id ? await db.sequelize.query(`SELECT count(*) FROM commentLikes WHERE commentLikes.c_id= ${c_id};`, {replacements: {c_id: `${c_id}`}, type: db.QueryTypes.SELECT}) : await db.sequelize.query(`SELECT count(*) FROM commentLikes WHERE commentLikes.r_id= ${r_id};`, {replacements: {r_id: `${r_id}`}, type: db.QueryTypes.SELECT})
            return {
                status: true,
                message: 'Comment unliked',
                data: {likeCount: likeCount?.length > 0 ? likeCount[0]?.['count(*)'] : 0}
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

const viewAllUserLikedComments = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {limit, offset} = await facetStage(req.body.page)
        const {c_id, r_id} = req.body
        let commentliked = await db.UserLikeComment.findAll({limit: limit, offset: offset, where: {[db.Op.or]: [c_id ? {c_id: c_id} : {r_id: r_id}]}, include: [{association: 'userLikes', attributes: ['id', 'first_name', 'last_name', 'image']}]})
        return {
            status: true,
            message: 'Comment Likes',
            data: commentliked
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

export {likeComment, unlikeComment, viewAllUserLikedComments}
