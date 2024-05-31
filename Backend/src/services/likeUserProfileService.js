import db from '../models/index.js'
import {getUserIdFromToken} from '../utilities/authentication.js'

import {facetStage} from './userService.js'

const addlikeUser = async (req) => {
    try {
        const {f_id} = req.body
        const u_id = await getUserIdFromToken(req)

        const user = await db.User.findOne({where: {id: u_id}})
        if (user) {
            const _like = await db.UserProfileLikes.findOne({where: {u_id: u_id, f_id: f_id}})

            if (_like) {
                return {
                    status: false,
                    message: 'Profile already liked'
                }
            }
            const findDisLike = await db.UserProfileDisLikes.findOne({where: {u_id: u_id, f_id: f_id}})
            if (findDisLike) {
                await db.UserProfileDisLikes.destroy({where: {u_id: u_id, f_id: f_id}})
            }
            const addDisLike = await db.UserProfileLikes.create({u_id: u_id, f_id: f_id})
            if (addDisLike) {
                const createdDisLike = await db.UserProfileLikes.findOne({where: {id: addDisLike?.id}, attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('f_id', f_id)), 'likeCount']]})
                return {
                    status: true,
                    message: 'Like Added to profile',
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

const removelikeProfile = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {f_id} = req.body
        const likeProfile = await db.UserProfileLikes.findOne({where: {u_id: u_id, f_id: f_id}})
        if (likeProfile) {
            await db.UserProfileLikes.destroy({where: {id: likeProfile?.id}})
            const likeCount = await db.sequelize.query(`SELECT count(*) FROM userProfileLikes WHERE userProfileLikes.f_id= ${f_id};`, {replacements: {f_id: `${f_id}`}, type: db.QueryTypes.SELECT})
            return {
                status: true,
                message: 'like Removed',
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

const viewAllUserLikedProfiles = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {limit, offset} = await facetStage(req.body.page)
        const {f_id} = req.body
        let allLikeUsers = await db.UserProfileLikes.findAll({limit: limit, offset: offset, where: {f_id: f_id}, include: [{association: 'likedFromUser', attributes: ['id', 'first_name', 'last_name', 'image']}]})
        return {
            status: true,
            message: 'User dislikes',
            data: allLikeUsers
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

export {addlikeUser, removelikeProfile, viewAllUserLikedProfiles}
