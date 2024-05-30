import db from '../models/index.js'

import { getUserIdFromToken } from '../utilities/authentication.js'

const updateUserNotification = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const userNotification = await db.UserNotification.findOne({ where: { u_id: u_id } })
        if (userNotification) {
            const _updateUserNotification = await db.UserNotification.update(req.body, { where: { u_id: u_id } })
            if (_updateUserNotification) {
                const updatedUserNotification = await db.UserNotification.findOne({ where: { u_id: u_id } })
                return {
                    status: true,
                    message: 'Notification list updated',
                    data: { userNotifcation: updatedUserNotification }
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

const deleteUserNotification = async (req) => {
    const { id } = req.params
    const u_id = await getUserIdFromToken(req)

    let user = await db.User.findOne({
        where: {
            id: u_id,
            [db.Op.or]: [{ disable: true }, { is_block: true }]
        }
    })

    if (user) {
        return {
            status: false,
            message: user?.is_block ? `You'r blocked by admin` : `Your account is disabled by admin`
        }
    }

    const notification = await db.notification.findOne({
        where: {
            id: id,
        }
    })

    if (notification) {
        const _deletedNotification = await db.notification.destroy({
            where: {
                id: id,
            }
        })

        if (_deletedNotification) {
            return {
                data: { notificationDeleted: true },
                status: true,
                message: `Notification deleted successfully`
            }
        } else {
            return {
                status: false,
                message: `Failed to delete notification`
            }
        }
    } else {
        return {
            status: false,
            message: `User Notification Not Found`
        }
    }
}

const viewUserNotification = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const userNotification = await db.UserNotification.findOne({ where: { u_id: u_id } })
        if (userNotification) {
            return {
                status: true,
                message: 'User notification list',
                data: { userNotification: userNotification }
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

export { updateUserNotification, deleteUserNotification, viewUserNotification }
