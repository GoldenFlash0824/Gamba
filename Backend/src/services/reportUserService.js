import db from '../models/index.js'
import {getUserIdFromToken} from '../utilities/authentication.js'

const reportUser = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {f_id, reason} = req.body
        const reportedUser = await db.User.findOne({where: {id: f_id}})
        if (reportedUser) {
            let report = await db.ReportUser.create({u_id: u_id, f_id: f_id, reason: reason})
            return {
                status: true,
                message: 'User reported',
                data: {reportUser: report}
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

const deleteReportedUser = async (req) => {
    try {
        const {id} = req.body
        if (id) {
            await db.ReportUser.destroy({where: {f_id: id}})
            return {
                status: true,
                message: 'Report against user deleted successfully'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const allReportedUsers = async (req) => {
    try {
        let reportUser = []
        let reportUserDatas = await db.sequelize.query(`SELECT f_id, COUNT(*) AS totalCount FROM reportUsers GROUP by f_id`, {type: db.QueryTypes.SELECT})
        for (let i = 0; i < reportUserDatas.length; i++) {
            let reportedUser = await db.User.findOne({where: {id: reportUserDatas[i].f_id}})
            let reportedUsers = await db.ReportUser.findAll({where: {f_id: reportUserDatas[i].f_id}})
            let users = []
            let reason = []
            for (let i = 0; i < reportedUsers.length; i++) {
                let user = await callBackUser(reportedUsers[i])
                user.auth_token = ''
                user.login_token = ''
                user.password = ''
                users.push({user, reason: reportedUsers[i].reason})
                reason.push(reportedUsers[i].reason)
            }
            if (reportedUser) {
                reportUser.push({...reportedUser.toJSON(), count: reportUserDatas[i].totalCount, users, reason})
            }
        }
        return {
            status: true,
            message: 'All reported users',
            data: reportUser
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const callBackUser = async (user_id) => {
    let user = await db.User.findOne({where: {id: user_id?.u_id}})
    let updatedUser = {
        user_name: user?.user_name,
        profile_image: user?.profile_image ? user?.profile_image : ''
    }
    return updatedUser
}

export {deleteReportedUser, reportUser, allReportedUsers}
