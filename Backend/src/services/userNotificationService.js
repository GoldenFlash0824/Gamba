import db from '../models/index.js'

import {getUserIdFromToken} from '../utilities/authentication.js'

const updateUserNotification = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const userNotification = await db.UserNotification.findOne({where: {u_id: u_id}})
        if (userNotification) {
            const _updateUserNotification = await db.UserNotification.update(req.body, {where: {u_id: u_id}})
            if (_updateUserNotification) {
                const updatedUserNotification = await db.UserNotification.findOne({where: {u_id: u_id}})
                return {
                    status: true,
                    message: 'Notification list updated',
                    data: {userNotifcation: updatedUserNotification}
                }
            }
            return {
                status: false,
                message: 'Notification list not updated'
            }
        }
        return {
            status: false,
            message: 'Notification list not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const viewUserNotification = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const userNotification = await db.UserNotification.findOne({where: {u_id: u_id}})
        if (userNotification) {
            return {
                status: true,
                message: 'User notification list',
                data: {userNotification: userNotification}
            }
        }
        return {
            status: false,
            message: 'User notification list not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

export {updateUserNotification, viewUserNotification}
