import db from '../models/index.js'
import {getUserIdFromToken} from '../utilities/authentication.js'

import {facetStage} from './userService.js'

const addDislikeComment = async (req) => {
    try {
        const {c_id, r_id} = req.body
        const u_id = await getUserIdFromToken(req)

        const findComment = c_id ? await db.UserPostComment.findOne({where: {id: c_id}}) : await db.UserPostReply.findOne({where: {id: r_id}})
        if (findComment) {
            const _likeComment = await db.DisLikeComment.findOne({where: {u_id: u_id, [db.Op.or]: [c_id ? {c_id: c_id} : {r_id: r_id}]}})
            if (_likeComment) {
                return {
                    status: false,
                    message: 'Comment already DisLike'
                }
            }
            const addDisLike = await db.DisLikeComment.create({u_id: u_id, u_id, c_id: c_id, r_id: r_id})
            if (addDisLike) {
                const createdDisLike = await db.DisLikeComment.findOne({where: {id: addDisLike?.id}, attributes: [c_id ? [db.sequelize.fn('COUNT', db.sequelize.col('c_id', c_id)), 'dislikeCount'] : [db.sequelize.fn('COUNT', db.sequelize.col('r_id', r_id)), 'dislikeCount']]})
                return {
                    status: true,
                    message: 'DisLike Added to comment',
                    data: createdDisLike
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

const removeDislikeComment = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {c_id, r_id} = req.body
        const likeComment = await db.DisLikeComment.findOne({where: {u_id: u_id, [db.Op.or]: [c_id ? {c_id: c_id} : {r_id: r_id}]}})
        if (likeComment) {
            await db.DisLikeComment.destroy({where: {u_id: u_id, [db.Op.or]: [c_id ? {c_id: c_id} : {r_id: r_id}]}})
            const likeCount = c_id ? await db.sequelize.query(`SELECT count(*) FROM disLikecomments WHERE disLikecomments.c_id= ${c_id};`, {replacements: {c_id: `${c_id}`}, type: db.QueryTypes.SELECT}) : await db.sequelize.query(`SELECT count(*) FROM disLikecomments WHERE disLikecomments.r_id= ${r_id};`, {replacements: {r_id: `${r_id}`}, type: db.QueryTypes.SELECT})
            return {
                status: true,
                message: 'Dislike Removed',
                data: likeCount?.length > 0 ? likeCount[0]?.['count(*)'] : true
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

const viewAllUserDisLikedComments = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {limit, offset} = await facetStage(req.body.page)
        const {c_id, r_id} = req.body
        let commentliked = await db.DisLikeComment.findAll({limit: limit, offset: offset, where: {[db.Op.or]: [c_id ? {c_id: c_id} : {r_id: r_id}]}, include: [{association: 'userDislikeComment', attributes: ['id', 'first_name', 'last_name', 'image']}]})
        return {
            status: true,
            message: 'Comment dislikes',
            data: commentliked
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

export {addDislikeComment, removeDislikeComment, viewAllUserDisLikedComments}
