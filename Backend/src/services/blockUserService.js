import db from '../models/index.js'
import {getUserIdFromToken} from '../utilities/authentication.js'

const blockUser = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {f_id} = req.body
        const user = await db.User.findOne({where: {id: f_id}})
        if (user) {
            let blockedUser = await db.BlockUser.create({u_id: u_id, f_id: f_id, date: new Date()})
            return {
                status: true,
                message: 'User blocked successfully',
                data: {userBlock: blockedUser}
            }
        }
        return {
            status: false,
            message: 'User not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const unBlockUser = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {id} = req.body
        if (id) {
            await db.BlockUser.destroy({where: {u_id: u_id, f_id: id}})
            return {
                status: true,
                message: 'User unblocked successfully'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const allBlockedUsers = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let blockedUser = []
        let blockedUserDatas = await db.sequelize.query(`SELECT f_id, COUNT(*) AS totalCount FROM blockUsers WHERE u_id = ${u_id} GROUP by f_id`, {type: db.QueryTypes.SELECT})
        for (let i = 0; i < blockedUserDatas.length; i++) {
            let user = await db.User.findOne({where: {id: blockedUserDatas[i].f_id}})
            if (user) {
                user.auth_token = ''
                user.login_token = ''
                user.password = ''
                blockedUser.push({...user.toJSON(), count: blockedUserDatas[i].totalCount})
            }
        }
        return {
            status: true,
            message: 'All blocked users',
            data: blockedUser
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

export {unBlockUser, blockUser, allBlockedUsers}
