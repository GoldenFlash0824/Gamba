import db from '../models/index.js'
import {getUserIdFromToken} from '../utilities/authentication.js'

import {facetStage} from './userService.js'

const addDislikeUser = async (req) => {
    try {
        const {f_id} = req.body
        const u_id = await getUserIdFromToken(req)

        const user = await db.User.findOne({where: {id: u_id}})
        if (user) {
            const _dislike = await db.UserProfileDisLikes.findOne({where: {u_id: u_id, f_id: f_id}})
            const findLike = await db.UserProfileLikes.findOne({where: {u_id: u_id, f_id: f_id}})
            if (findLike) {
                await db.UserProfileLikes.destroy({where: {u_id: u_id, f_id: f_id}})
            }
            if (_dislike) {
                return {
                    status: false,
                    message: 'Profile already DisLike'
                }
            }
            const addDisLike = await db.UserProfileDisLikes.create({u_id: u_id, f_id: f_id})
            if (addDisLike) {
                const createdDisLike = await db.UserProfileDisLikes.findOne({where: {id: addDisLike?.id}, attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('f_id', f_id)), 'dislikeCount']]})
                return {
                    status: true,
                    message: 'DisLike Added to profile',
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
            message: 'User profile not found.'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const removeDislikeProfile = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {f_id} = req.body
        const likeComment = await db.UserProfileDisLikes.findOne({where: {u_id: u_id, f_id: f_id}})
        if (likeComment) {
            await db.UserProfileDisLikes.destroy({where: {id: likeComment?.id}})
            const likeCount = await db.sequelize.query(`SELECT count(*) FROM userProfileDislikes WHERE userProfileDislikes.f_id= ${f_id};`, {replacements: {f_id: `${f_id}`}, type: db.QueryTypes.SELECT})
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

const viewAllUserDisLikedProfiles = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {limit, offset} = await facetStage(req.body.page)
        const {f_id} = req.body
        let allDislikeUsers = await db.UserProfileDisLikes.findAll({limit: limit, offset: offset, where: {f_id: f_id}, include: [{association: 'dislikedFromUser', attributes: ['id', 'first_name', 'last_name', 'image']}]})
        return {
            status: true,
            message: 'User dislikes',
            data: allDislikeUsers
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

export {addDislikeUser, removeDislikeProfile, viewAllUserDisLikedProfiles}
