import moment from 'moment-timezone'
import NotificationMessage from '../enums/notification-message.js'
import NotificationEnum from '../enums/notification-type-enum.js'
import db from '../models/index.js'
import { sendNotification } from '../notification/sendNotification.js'
import { getUserIdFromToken } from '../utilities/authentication.js'
import { deleteImage, s3ImageUpload } from './aws.js'
import { notificationEmail } from './emailService.js'
import { facetStage } from './userService.js'

const createEvent = async (req) => {
    const { price, location, start_date, end_date, summary, latitude, longitude, image, title, is_private, privacy, limit_to, limit_to_number } = req.body
    let eventImage = await s3ImageUpload(image)

    let startDate = moment.tz(start_date, process.env.TIME_ZONE).format()
    let endDate = moment.tz(end_date, process.env.TIME_ZONE).format()
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

    let _createEvent = await db.Events.create({ price: price, location: location, summary: summary, start_date: startDate, u_id: u_id, end_date: endDate, latitude: latitude, longitude: longitude, image: eventImage, title: title, is_private: is_private, status: false, privacy: privacy, limit_to: limit_to || null, limit_to_number: limit_to_number || null })

    if (_createEvent) {
        return {
            data: { event: _createEvent },
            status: true,
            message: `Event created successfully`
        }
    } else {
        return {
            status: false,
            message: `Failed to create event`
        }
    }
}

const getAllEvent = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { limit, offset } = await facetStage(req.query.page)
    const currentDate = moment.tz(moment().format(), process.env.TIME_ZONE).format()

    console.log('================currentDate', currentDate)
    //disable user event
    let disable_user_data = await db.User.findAll({
        where: {
            disable: true
        }
    })
    let disable_user_id = []
    disable_user_id = disable_user_data?.length ? disable_user_data.map((n) => n.id) : []

    let all_disable_user_event = await db.Events.findAll({
        where: {
            u_id: { [db.Op.in]: disable_user_id }
        },
        attributes: ['id', 'u_id']
    })
    all_disable_user_event = all_disable_user_event.map((event) => event.id)

    //end disable user Event
    let event_data = await db.hideEvent.findAll({
        where: {
            u_id: u_id
        }
    })
    let event_id_details = []
    event_id_details = event_data?.length ? event_data.map((e) => e.event_id) : []

    let concate_event_array = event_id_details.concat(all_disable_user_event)
    let _allEvent = await db.Events.findAll({
        include: [
            {
                association: 'joinEvent',
                include: [
                    {
                        association: 'joinEventUser'
                    }
                ]
            },
            {
                model: db.User,
                as: 'eventUser',
                attributes: ['id', 'first_name', 'last_name', 'image', 'chat_id', 'lat', 'log', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format']
            }
        ],
        where: {
            status: false,
            id: { [db.Op.notIn]: concate_event_array },
            end_date: { [db.Op.gte]: currentDate },
            [db.Op.or]: [{ privacy: 'Public' }, db.sequelize.literal(`EXISTS(SELECT * FROM favoriteSellers WHERE favoriteSellers.seller_id = ${u_id}  AND userEvents.privacy='My Network' AND favoriteSellers.u_id = userEvents.u_id)`), db.sequelize.literal(`EXISTS(SELECT * FROM userEvents as event WHERE userEvents.privacy='My Network' AND event.id=userEvents.id AND event.u_id = ${u_id})`)]
        },
        attributes: { include: [[db.sequelize.literal(`EXISTS(SELECT * FROM joinEvents WHERE event_id = userEvents.id AND u_id = ${u_id})`), 'isJoinMe']] },

        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']]
    })
    // console.log('=========_allEvent', _allEvent[0].end_date)
    if (_allEvent) {
        return {
            data: { event: _allEvent },
            status: true,
            message: ` All Event data `
        }
    } else {
        return {
            status: false,
            message: `Failed to get Event`
        }
    }
}

// where: {[db.Op.and]: [{is_trade: true, is_donation: false, discount: 0}, {name: {[db.Op.like]: '%' + filter + '%'}}]},

const searchEvents = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const filter = req.query.filter
    const { limit, offset } = await facetStage(req.query.page)
    const currentDate = moment.tz(moment().format(), process.env.TIME_ZONE).format()
    //disable user event
    let disable_user_data = await db.User.findAll({
        where: {
            disable: true
        }
    })
    let disable_user_id = []
    disable_user_id = disable_user_data?.length ? disable_user_data.map((n) => n.id) : []

    let all_disable_user_event = await db.Events.findAll({
        where: {
            u_id: { [db.Op.in]: disable_user_id }
        },
        attributes: ['id', 'u_id']
    })
    all_disable_user_event = all_disable_user_event.map((event) => event.id)

    //end disable user Event
    let event_data = await db.hideEvent.findAll({
        where: {
            u_id: u_id
        }
    })
    let event_id_details = []
    event_id_details = event_data?.length ? event_data.map((e) => e.event_id) : []

    let concate_event_array = event_id_details.concat(all_disable_user_event)

    const userIds = await db.User.findAll({
        attributes: ['id'],
        where: {
            [db.Op.or]: [
                db.sequelize.literal(`CONCAT(first_name,'',last_name) LIKE '%${filter}%'`),
                db.sequelize.literal(`CONCAT(first_name ,' ', last_name) LIKE '%${filter}%'`),
                { first_name: { [db.Op.like]: `%${filter}%` } },
                { last_name: { [db.Op.like]: `%${filter}%` } },

            ],
        },
    });


    const userIdsArray = userIds.map(category => category.id);

    let _allEvent = await db.Events.findAll({
        include: [
            {
                association: 'joinEvent',
                include: [
                    {
                        association: 'joinEventUser'
                    }
                ]
            },
            {
                model: db.User,
                as: 'eventUser',
                attributes: ['id', 'image', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'disable'],
                where: {
                    disable: false
                }
            }
        ],
        where: {
            status: false,
            [db.Op.or]: [{
                u_id: {
                    [db.Op.in]: userIdsArray,
                }
            }, { title: { [db.Op.like]: '%' + filter + '%' } }, { summary: { [db.Op.like]: '%' + filter + '%' } }],
            [db.Op.and]: [{ id: { [db.Op.notIn]: concate_event_array } }, { end_date: { [db.Op.gte]: currentDate } }, { [db.Op.or]: [{ privacy: 'Public' }, db.sequelize.literal(`EXISTS(SELECT * FROM favoriteSellers WHERE favoriteSellers.seller_id = ${u_id}  AND userEvents.privacy='My Network' AND favoriteSellers.u_id = userEvents.u_id)`), db.sequelize.literal(`EXISTS(SELECT * FROM userEvents as event WHERE userEvents.privacy='My Network' AND event.id=userEvents.id AND event.u_id = ${u_id})`)] }]
        },

        attributes: { include: [[db.sequelize.literal(`EXISTS(SELECT * FROM joinEvents WHERE event_id = userEvents.id AND u_id = ${u_id})`), 'isJoinMe']] },
        // limit: limit,
        // offset: offset,
        order: [['createdAt', 'DESC']]
    })

    if (_allEvent) {
        return {
            data: { event: _allEvent },
            status: true,
            message: ` All Event data `
        }
    } else {
        return {
            status: false,
            message: `Failed to get Event`
        }
    }
}

const searchMyEvents = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const filter = req.query.filter
    const { limit, offset } = await facetStage(req.query.page)
    let _allEvent = await db.Events.findAll({
        include: [
            {
                association: 'joinEvent',
                include: [
                    {
                        association: 'joinEventUser'
                    }
                ]
            },
            {
                model: db.User,
                as: 'eventUser',
                attributes: ['id', 'image', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format']
            }
        ],
        where: {
            [db.Op.and]: [
                {
                    u_id: u_id,
                    status: false,
                    [db.Op.or]: [{ title: { [db.Op.like]: '%' + filter + '%' } }, { summary: { [db.Op.like]: '%' + filter + '%' } }]
                }
            ]
        },
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']]
    })

    if (_allEvent) {
        return {
            data: { event: _allEvent },
            status: true,
            message: ` All Event data `
        }
    } else {
        return {
            status: false,
            message: `Failed to get Event`
        }
    }
}

const getSingleUserEvent = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { limit, offset } = await facetStage(req.query.page)
    let _allEvent = await db.Events.findAll({
        include: [
            {
                association: 'joinEvent',
                include: [
                    {
                        association: 'joinEventUser'
                    }
                ]
            },
            {
                model: db.User,
                as: 'eventUser',
                attributes: ['id', 'first_name', 'last_name', 'image', 'chat_id', 'lat', 'log', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format']
            }
        ],
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
        where: { u_id: u_id }
    })

    if (_allEvent) {
        return {
            data: { event: _allEvent },
            status: true,
            message: `User Event data`
        }
    } else {
        return {
            status: false,
            message: `Failed to get Event`
        }
    }
}

const deleteEvent = async (req) => {
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

    const { id } = req.params
    let _event = await db.Events.findOne({ where: { id: id, u_id: u_id } })

    if (_event) {
        await deleteImage(_event.image)
        await db.Events.destroy({
            where: { id: id, u_id: u_id }
        })
        return {
            status: true,
            message: `Event is deleted`
        }
    }
    return {
        status: false,
        message: `Failed to delete event`
    }
}

const updateEvent = async (req) => {
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

    const { id } = req.params
    const { image, price, start_date, end_date, summary, latitude, longitude, title, limit_to_number, privacy, location, is_private, limit_to } = req.body

    let startDate = moment.tz(start_date, process.env.TIME_ZONE).format()
    let endDate = moment.tz(end_date, process.env.TIME_ZONE).format()

    let updateImage = ''
    let _event = await db.Events.findOne({ where: { id: id, u_id: u_id } })
    console.log(_event)

    if (_event) {
        if (image && _event.image != image) {
            await deleteImage(_event.image)
            updateImage = await s3ImageUpload(image)
        } else {
            updateImage = _event.image
        }

        await db.Events.update(
            { price: price || _event.price, start_date: startDate || _event.start_date, end_date: endDate || _event.end_date, summary: summary || _event.summary, latitude: latitude || _event.latitude, longitude: longitude || _event.longitude, image: updateImage, title: title || _event.title, location: location ? location : _event?.location, is_private: is_private, limit_to: limit_to || null, limit_to_number: limit_to_number || null, privacy: privacy },
            {
                where: { id: id, u_id: u_id }
            }
        )
        let check_join_event_details = await db.joinEvent.findOne({ where: { event_id: id } })

        if (check_join_event_details) {
            let user_id_array = await db.joinEvent.findAll({
                where: { event_id: id },

                raw: true
            })

            user_id_array = user_id_array?.length ? user_id_array.map((e) => e.u_id) : []

            user_id_array.forEach(async (userID) => {
                await db.notification.create({
                    u_id: u_id,
                    event_id: id,
                    type: NotificationEnum.UPDATE_EVENT,
                    f_id: userID,
                    message: NotificationMessage.UPDATE_EVENT_MSG
                })
            })
        }

        return {
            status: true,
            message: `Event is updated successfully`
        }
    }
    return {
        status: false,
        message: `Failed to Update event`
    }
}

const getPopularEvent = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { limit, offset } = await facetStage(req.query.page)
        const currentDate = moment.tz(moment().format(), process.env.TIME_ZONE).format()
        let event_data = await db.hideEvent.findAll({
            where: {
                u_id: u_id
            }
        })
        let event_id_details = []
        event_id_details = event_data?.length ? event_data.map((e) => e.event_id) : []
        let _allEvent = await db.Events.findAll({
            where: {
                status: false,
                id: { [db.Op.notIn]: event_id_details },
                u_id: { [db.Op.ne]: u_id },
                end_date: { [db.Op.gte]: currentDate },
                [db.Op.or]: [{ privacy: 'Public' }, db.sequelize.literal(`EXISTS(SELECT * FROM favoriteSellers WHERE favoriteSellers.seller_id = ${u_id}  AND userEvents.privacy='My Network' AND favoriteSellers.u_id = userEvents.u_id)`), db.sequelize.literal(`EXISTS(SELECT * FROM userEvents as event WHERE userEvents.privacy='My Network' AND event.id=userEvents.id AND event.u_id = ${u_id})`)]
            },
            include: [
                {
                    model: db.User,

                    as: 'eventUser',
                    attributes: ['id', 'image', 'chat_id', 'lat', 'log', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'first_name', 'last_name', 'disable'],
                    where: {
                        disable: false
                    }
                }
            ],

            attributes: { include: [[db.sequelize.literal(`CASE WHEN EXISTS(SELECT 1 FROM favoriteSellers WHERE favoriteSellers.seller_id = userEvents.u_id AND favoriteSellers.u_id = ${u_id}) THEN TRUE ELSE FALSE END`), 'isFev']] },
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            group: ['u_id']
        })
        const latestEvent = _allEvent.slice(0, 10)
        if (_allEvent) {
            return {
                data: { event: latestEvent },
                status: true,
                message: ` All Event data `
            }
        } else {
            return {
                status: false,
                message: `Failed to get Event`
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const joinEvent = async (req) => {
    const u_id = await getUserIdFromToken(req)
    let user = await db.User.findOne({ id: u_id })
    const { event_id, payment_id } = req.body

    try {
        let event_data = await db.Events.findOne({
            where: {
                id: event_id
            },
            attributes: {
                include: [
                    [db.sequelize.literal(`EXISTS(SELECT * FROM joinEvents WHERE event_id = userEvents.id AND u_id = ${u_id})`), 'isJoinMe'],
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM joinEvents WHERE event_id = userEvents.id)`), 'total_participants']
                ]
            },
            include: [
                {
                    association: 'joinEvent',
                    include: [
                        {
                            association: 'joinEventUser',
                            attributes: ['id', 'first_name', 'last_name', 'image', 'email', 'chat_id']
                        }
                    ]
                }
            ]
        })

        const string = event_data?.limit_to
        const match = string.match(/\d+/) // Match one or more digits
        let limit = 0
        if (match) {
            const number = parseInt(match[0])
            limit = number
        } else {
            console.log('No number found')
        }

        if (event_data?.dataValues?.total_participants >= limit) {
            return {
                status: false,
                message: `Event participants limit completed`
            }
        }

        let all_ready_join = await db.joinEvent.findOne({
            where: {
                event_id: event_id,
                u_id: u_id
            }
        })

        if (all_ready_join) {
            return {
                status: false,
                message: ` this event is allready join by you `
            }
        }

        await db.joinEvent.create({
            u_id: u_id,
            event_id: event_id,
            payment_id: payment_id
        })

        event_data = await db.Events.findOne({
            where: {
                id: event_id
            },
            attributes: {
                include: [
                    [db.sequelize.literal(`EXISTS(SELECT * FROM joinEvents WHERE event_id = userEvents.id AND u_id = ${u_id})`), 'isJoinMe'],
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM joinEvents WHERE event_id = userEvents.id)`), 'total_participants']
                ]
            },
            include: [
                {
                    association: 'joinEvent',
                    include: [
                        {
                            association: 'joinEventUser',
                            attributes: ['id', 'first_name', 'last_name', 'image', 'email']
                        }
                    ]
                }
            ]
        })

        if (u_id != event_data.u_id) {
            await db.notification.create({
                u_id: u_id,
                event_id: event_id,
                type: NotificationEnum.JOIN_EVENT,
                f_id: event_data.u_id,
                message: NotificationMessage.JOIN_EVENT_MSG
            })

            let check_email_notification = await db.notificationSetting.findOne({
                where: {
                    u_id: event_data.u_id
                },
                raw: true
            })
            if (check_email_notification?.email_notification == true) {
                let user_that_join_event = await db.User.findOne({ where: { id: u_id }, raw: true })
                let email_of_owner_event = await db.User.findOne({ where: { id: event_data.u_id }, raw: true })
                await notificationEmail(email_of_owner_event.email, user_that_join_event.first_name, NotificationMessage.JOIN_EVENT_MSG)
            }

            if (check_email_notification?.sms_notification == true) {
                // let user_that_like_post = await db.User.findOne({ where: { id: u_id }, raw: true })
                // let phone_of_owner_post = await db.User.findOne({ where: { id: event_data.u_id }, raw: true })
                // await smsNotification(phone_of_owner_post.phone, user_that_like_post.first_name, NotificationMessage.JOIN_EVENT_MSG)
            }

            if (event_data?.eventUser?.fcm_token) {
                let message = {
                    token: event_data?.eventUser?.fcm_token,
                    notification: {
                        title: `Join Event`,
                        body: `${user?.first_name + ' ' + user?.last_name} Join the Event`
                    },
                    data: { data: JSON.stringify(event_data) }
                }
                await sendNotification(message)
            }
        }

        return {
            data: event_data,
            status: true,
            message: ` Event is join  `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const unJoinEvent = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { event_id, payment_id } = req.body

    try {
        let all_ready_join = await db.joinEvent.findOne({
            where: {
                event_id: event_id,
                u_id: u_id
            }
        })

        if (all_ready_join) {
            await db.joinEvent.destroy({
                where: {
                    event_id: event_id,
                    u_id: u_id
                }
            })

            let event_data = await db.Events.findOne({
                where: {
                    id: event_id
                },
                attributes: { include: [[db.sequelize.literal(`EXISTS(SELECT * FROM joinEvents WHERE event_id = userEvents.id AND u_id = ${u_id})`), 'isJoinMe']] },
                include: [
                    {
                        association: 'joinEvent',
                        include: [
                            {
                                association: 'joinEventUser',
                                attributes: ['id', 'first_name', 'last_name', 'image', 'email', 'chat_id']
                            }
                        ]
                    }
                ]
            })

            return {
                data: event_data,
                status: true,
                message: `Event is unJoined`
            }
        }

        return {
            status: false,
            message: ` Event not found`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const removeUserFromEvent = async (req) => {
    const { event_id, u_id } = req.body

    try {
        let all_ready_join = await db.joinEvent.findOne({
            where: {
                event_id: event_id,
                u_id: u_id
            }
        })

        if (all_ready_join) {
            await db.joinEvent.destroy({
                where: {
                    event_id: event_id,
                    u_id: u_id
                }
            })

            let event_data = await db.Events.findOne({
                where: {
                    id: event_id
                },
                attributes: { include: [[db.sequelize.literal(`EXISTS(SELECT * FROM joinEvents WHERE event_id = userEvents.id AND u_id = ${u_id})`), 'isJoinMe']] },
                include: [
                    {
                        association: 'joinEvent',
                        include: [
                            {
                                association: 'joinEventUser',
                                attributes: ['id', 'first_name', 'last_name', 'image', 'email', 'chat_id']
                            }
                        ]
                    }
                ]
            })

            return {
                data: event_data,
                status: true,
                message: `Event is unJoined`
            }
        }

        return {
            status: false,
            message: ` Event not found`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const getJoinEventDetail = async (req) => {
    try {
        let _allEvent = await db.Events.findAll({
            include: [
                {
                    association: 'joinEvent',
                    include: [
                        {
                            association: 'joinEventUser',
                            attributes: ['id', 'first_name', 'last_name', 'image', 'chat_id']
                        }
                    ]
                }
            ],
            where: {
                status: false
            },

            order: [['createdAt', 'DESC']]
        })
        return {
            data: _allEvent,
            status: true,
            message: ` all detail of joint event   `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const getEventById = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { event_id } = req.body
        const { limit, offset } = await facetStage(req.query.page)
        let _allEvent = await db.Events.findOne({
            where: {
                status: false,
                id: event_id
            },
            attributes: { include: [[db.sequelize.literal(`EXISTS(SELECT * FROM joinEvents WHERE event_id = userEvents.id AND u_id = ${u_id})`), 'isJoinMe']] },
            include: [
                {
                    association: 'joinEvent',
                    include: [
                        {
                            association: 'joinEventUser'
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'eventUser',
                    attributes: ['id', 'image', 'chat_id', 'lat', 'log', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'first_name', 'last_name']
                }
            ],

            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        })

        if (_allEvent) {
            return {
                data: _allEvent,
                status: true,
                message: ` single Event data `
            }
        } else {
            return {
                status: false,
                message: `Failed to get Event`
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const hideEvent = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { event_id } = req.body
    try {
        let hideEventData = await db.hideEvent.create({
            event_id: event_id,
            u_id: u_id
        })
        return {
            data: hideEventData,
            status: true,
            message: `Event is hide`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

export { createEvent, getAllEvent, getSingleUserEvent, updateEvent, deleteEvent, getPopularEvent, joinEvent, getJoinEventDetail, getEventById, searchEvents, searchMyEvents, hideEvent, unJoinEvent, removeUserFromEvent }
