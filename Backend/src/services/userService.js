import db from '../models/index.js'
import { generateAccessToken, getUserIdFromToken, generateAccessTokenAutoLogin } from '../utilities/authentication.js'
import { hashPassword, comparePassword } from '../utilities/passwordUtils.js'
import { sendNotification } from '../notification/sendNotification.js'
import { deleteImage, deleteMultipleImage, s3SharpImageUpload } from './aws.js'
import NotificationEnum from '../enums/notification-type-enum.js'
import { connectTradeProductEmail, contactUsEmail, newPasswordEmail, passwordUpdated, resetPasswordEmail, verificationCodeEmail, welcomeEmail, connectGiveAwayProductBuyerEmail, connectGiveAwayProductSellerEmail } from './emailService.js'
import moment from 'moment'
import axios from 'axios'


const registerUser = async (req) => {
    try {
        const { first_name, last_name, email, password, image, social_id, fcm_token, phone, confirmPassword, address } = req.body
        let user = await db.User.findOne({ where: { email: { [db.Op.eq]: `${email}` } } })
        if (user && user?.is_deleted) {
            const updatedAt = moment(user?.updatedAt);
            const currentTime = moment();
            const duration = moment.duration(currentTime.diff(updatedAt));

            const isLongerThanThreeMonths = duration.asMonths() > 3;
            if (isLongerThanThreeMonths) {
                await db.User.destroy({ where: { email: { [db.Op.eq]: `${email}` } } })
                user = await db.User.findOne({ where: { email: { [db.Op.eq]: `${email}` } } })
            }

        }

        if (!user) {
            if (password !== confirmPassword) {
                return {
                    status: false,
                    message: 'Password and confirm password did not match'
                }
            }
            const userphone = await db.User.findOne({ where: { phone: { [db.Op.eq]: `${phone}` } } })
            if (userphone) {
                return {
                    status: false,
                    message: 'PHONE NUMBER IN ALREADY USED'
                }
            }

            const verifyCode = await randomCode()

            // const verifyCode = 123000

            const bcryptPassword = await hashPassword(password)
            let dataa = image && (await s3SharpImageUpload(image))
            let _createUser = await db.User.create({ first_name: first_name, last_name: last_name, email: email, password: bcryptPassword, image: dataa, social_id: social_id, fcm_token: fcm_token, phone: phone, verification_code: verifyCode, address: address })
            if (_createUser) {
                _createUser = await db.User.findOne({ where: { id: _createUser.id } })

                // _createUser.verification_code = ''
                // _createUser.password = ''

                const token = await generateAccessToken(_createUser)
                _createUser.auth_token = token
                _createUser.login_token = token
                await db.User.update({ auth_token: token, login_token: token }, { where: { id: _createUser.id } })
                let filterInfo = await db.User.findOne({ where: { id: _createUser.id }, attributes: ['id', 'first_name', 'last_name', 'email', 'auth_token', 'login_token', 'social_id', 'image', 'fcm_token', 'phone'] })
                await welcomeEmail(_createUser, email)
                await verificationCodeEmail(verifyCode, email)

                //for phone number
                // await sendSms(phone, verifyCode)

                const chemicalData = await db.Chemicals.findAll({})
                const categoryData = await db.Categories.findAll({})
                return {
                    status: true,
                    message: 'User registered successfully',
                    data: { user: filterInfo, chemicalData, categoryData }
                }
            }
        } else {
            if (user?.is_deleted) {
                return {
                    status: false,
                    message: 'User account under construction to delete'
                }
            } else {
                return {
                    status: false,
                    message: 'User with this email already exist'
                }
            }

        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const userProfile = async (req) => {
    const u_id = await getUserIdFromToken(req)

    if (u_id) {
        let _profile = await db.User.findOne({
            include: [
                {
                    model: db.UserProducts,
                    as: 'userProducts',
                    attributes: {
                        include: [
                            [
                                db.sequelize.literal(`(
                                    SELECT COUNT(*)
                                    FROM favorites
                                    WHERE product_id = userProducts.id
                                )`),
                                'num_favorites'
                            ]
                        ]
                    }
                }
            ],
            attributes: {
                exclude: ['password', 'verification_code']
            },
            where: { id: u_id }
        })
        let totalProduct = await db.UserProducts.findAll({ where: { u_id: u_id } })
        let totalProducts = totalProduct.length
        //let totalSoldproduct=await
        return {
            data: { info: { ..._profile.dataValues, totalProducts } },
            status: true,
            message: `my profile data `
        }
    } else {
        return {
            status: false,
            message: `error `
        }
    }
}

const updateUser = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let { first_name, last_name, phone, image, about, dob, gender, address, chat_id, email } = req.body
        let lat
        let log
        const user = await db.User.findOne({ where: { id: u_id } })
        if (email && email != user?.email) {
            const user = await db.User.findOne({ where: { email: email } })
            if (user) {
                return {
                    status: false,
                    message: 'Email address already in use'
                }
            }
        }

        const geocodeResponse =
            address &&
            (await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: 'AIzaSyCyeed677ICVk7ZvQARsvHpE0P5Mjgx52Q'
                }
            }))

        const results = geocodeResponse?.data?.results
        if (results?.length > 0) {
            const location = results[0]?.geometry?.location
            lat = location?.lat
            log = location?.lng
        } else {
            console.log('No results found for the address')
        }

        if (user) {
            // if (!user?.is_verified) {
            //     return {
            //         status: false,
            //         message: `User account is not verified`
            //     }
            // }
            let update_user = ''
            let newImage = ''
            if (user?.image !== image) {
                if (image) {
                    let prevImage = user.image
                    await deleteImage(prevImage)
                    newImage = await s3SharpImageUpload(image)
                }

                update_user = await db.User.update({ first_name: first_name ? first_name : user?.first_name, last_name: last_name ? last_name : user?.last_name, phone: phone ? phone : user?.phone, image: newImage ? newImage : user?.image, about: about ? about : user?.about, dob: dob && dob != 'Invalid date' ? dob : user?.dob ? user?.dob : null, gender: gender ? gender : user?.gender, address: address ? address : user?.address, lat: lat ? lat : user?.lat, log: log ? log : user?.log, chat_id: chat_id ? chat_id : user?.chat_id, email: email ? email : user?.email }, { where: { id: user?.id } })
            } else {
                update_user = await db.User.update({ first_name: first_name ? first_name : user?.first_name, last_name: last_name ? last_name : user?.last_name, phone: phone ? phone : user?.phone, about: about ? about : user?.about, dob: dob && dob != 'Invalid date' ? dob : user?.dob ? user?.dob : null, gender: gender ? gender : user?.gender, address: address ? address : user?.address, lat: lat ? lat : user?.lat, log: log ? log : user?.log, chat_id: chat_id ? chat_id : user?.chat_id, email: email ? email : user?.email }, { where: { id: user?.id } })
            }

            if (update_user) {
                let updatedUser = await db.User.findOne({ where: { id: u_id } })
                //updatedUser.password = ''
                return {
                    status: true,
                    message: `Changes were saved successfully`,
                    data: { updatedUser: updatedUser }
                }
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

const updateSocialUser = async (req) => {
    try {
        let popup = []
        const { u_id } = req.body
        const user = await db.User.findOne({ where: { id: u_id } })
        if (user) {
            const update_user = await db.User.update(
                {
                    is_verified: true
                },
                { where: { id: user.id } }
            )
            if (update_user) {
                const existnotification = await db.UserNotification.findOne({ where: { u_id: user.id } })
                if (!existnotification) {
                    await db.UserNotification.create({ u_id: user.id })
                }

                return {
                    status: true,
                    message: `User updated successfully`,
                    data: { user: user, popUp: popup }
                }
            }
            return {
                status: false,
                message: `Error updating user`,
                data: ''
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

const autoLogin = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        //const {fcm_token} = req.body
        if (u_id) {
            const user = await db.User.findOne({ where: { id: u_id } })
            if (!user?.is_block) {
                const token = await generateAccessTokenAutoLogin(user)
                const updatedToken = await db.User.update({ auth_token: token, login_token: token }, { where: { id: u_id } })
                if (updatedToken) {
                    const updatedUser = await db.User.findOne({ where: { id: u_id } })
                    updatedUser.password = ''
                    const chemicalData = await db.Chemicals.findAll({})
                    const categoryData = await db.Categories.findAll({})
                    return {
                        status: true,
                        message: 'User auto login successful',
                        data: { user: updatedUser, chemicalData, categoryData }
                    }
                }
            } else {
                return {
                    status: false,
                    message: 'You are blocked. Please contact admin'
                }
            }
        }
        return {
            status: false,
            message: 'User not verified'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}
//qqq
const loginUser = async (req) => {
    try {
        const { email, password, lat, log, remember_me } = req.body
        let user = await db.User.findOne({ where: { email: email } })
        if (user) {
            if (user?.is_deleted) {
                return {
                    status: false,
                    message: 'User account not found'
                }
            }
            let checkPassword = await comparePassword(password, user.password)
            if (checkPassword) {
                if (user?.is_block == true || user?.is_block_payment == true) {
                    return {
                        status: false,
                        message: 'You are blocked by Admin '
                    }
                }

                if (!user?.blocked && user.is_verified == true) {
                    await db.User.update({ auth_token: '' }, { where: { id: user.id } })
                    const loginUser = await db.User.findOne({ where: { id: user.id } })
                    const auth_token = await generateAccessToken(loginUser)
                    const login_token = await generateAccessTokenAutoLogin(loginUser)

                    let updateUser = null
                    updateUser = await db.User.update({ auth_token: auth_token, login_token: login_token }, { where: { id: user.id } })
                    const userinfo = await db.User.findOne({ where: { email: email }, attributes: { exclude: ['password', 'verification_code',] } })

                    const chemicalData = await db.Chemicals.findAll({})
                    const categoryData = await db.Categories.findAll({})

                    if (userinfo?.two_fector_auth_check_detail) {
                        const code = await randomCode()
                        await db.User.update({ verification_code: code, two_fector_auth: false }, { where: { email: email } })
                        await verificationCodeEmail(code, email)
                    }

                    return {
                        status: true,
                        message: 'User logged in successfully',
                        data: { user: userinfo, chemicalData, categoryData, isDisable: user.disable }
                    }
                } else {
                    let user = await db.User.findOne({ where: { email: email }, attributes: { exclude: ['password', 'verification_code',] } })
                    const chemicalData = await db.Chemicals.findAll({})
                    const categoryData = await db.Categories.findAll({})

                    if (user?.two_fector_auth_check_detail) {
                        const code = await randomCode()
                        await db.User.update({ verification_code: code, two_fector_auth: false }, { where: { email: email } })
                        await verificationCodeEmail(code, email)
                    }
                    if (!user.is_verified) {
                        const code = await randomCode()
                        await db.User.update({ verification_code: code }, { where: { email: email } })

                        await verificationCodeEmail(code, email)
                        return {
                            status: true,
                            message: 'Your account not verified, please verify your account to continue',
                            data: { is_verified: user.is_verified, user: user, chemicalData: chemicalData, categoryData: categoryData }
                        }
                    }
                    return {
                        status: false,
                        message: 'You are blocked. Please contact admin or not verified or disable ',
                        data: { is_verified: user.is_verified, user: user, chemicalData: chemicalData, categoryData: categoryData }
                    }
                }
            }
            return {
                status: false,
                message: 'Wrong password'
            }
        } else {
            return {
                status: false,
                message: 'User with this email not exist'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const socialLogin = async (req, res) => {
    try {
        const { platform, provider, social_id, lat, lng, fcm_token, email, name } = req.body
        //login case with google
        if (provider === 'google') {
            const userBySocialId = await db.User.findOne({ where: { social_id: social_id } })
            // if user already registered with google and now try to login with Google
            if (userBySocialId) {
                if (!userBySocialId?.blocked) {
                    const social_id_user = await socaiLoginUser(userBySocialId, fcm_token, platform)
                    return {
                        status: true,
                        message: 'User auto login successful',
                        data: { user: social_id_user, isNewUser: false }
                    }
                } else {
                    return {
                        status: false,
                        message: 'You are blocked. Please contact admin'
                    }
                }
            }
            if (platform != 'web') {
                //1st Time Registeration With Google

                const _createUser = await db.User.create({ firstName: name, email: email, social_id: social_id })
                if (_createUser) {
                    const user = await db.User.findOne({ where: { id: _createUser.id } })
                    const token = await generateAccessToken(user)
                    user.auth_token = token
                    user.login_token = token
                    user.password = ''
                    await db.User.update({ auth_token: token, login_token: token, fcm_token: fcm_token, is_verified: false }, { where: { id: _createUser.id } })
                    return {
                        status: true,
                        message: 'User signed up successfully with Google',
                        data: { user: user, isNewUser: true }
                    }
                }
            } else {
                return {
                    status: false,
                    message: 'You can not signup from web. Please install the gamba mobile app and register your account first.'
                }
            }
            return {
                status: false,
                message: 'Something went wrong. Please try again later.'
            }
        } else if (provider === 'apple') {
            const userBySocialId = await db.User.findOne({ where: { social_id: social_id } })
            if (userBySocialId) {
                if (!userBySocialId?.blocked) {
                    const social_id_user = await socaiLoginUser(userBySocialId, fcm_token, platform)
                    return {
                        status: true,
                        message: 'User logged in successfully with Apple',
                        data: { user: social_id_user, isNewUser: false }
                    }
                } else {
                    return {
                        status: false,
                        message: 'You are blocked. Please contact admin'
                    }
                }
            }
            //regsiter case with apple 1st time
            const _createUser = await db.User.create(req.body)
            if (_createUser) {
                const user = await db.User.findOne({ where: { id: _createUser.id } })
                const token = await generateAccessToken(user)
                user.auth_token = token
                user.login_token = token
                await db.User.update({ auth_token: token, login_token: token, fcm_token: fcm_token, is_verified: false }, { where: { id: _createUser.id } })
                return {
                    status: true,
                    message: 'User signed up successfully with Apple',
                    data: { user: user, isNewUser: true }
                }
            }
            return {
                status: false,
                message: 'Something went wrong. Please try again later.'
            }
        } else if (provider === 'fb') {
            const userBySocialId = await db.User.findOne({ where: { social_id: social_id } })
            if (userBySocialId) {
                if (!userBySocialId?.blocked) {
                    const social_id_user = await socaiLoginUser(userBySocialId, fcm_token, platform)
                    return {
                        status: true,
                        message: 'User logged in successfully with Facebook',
                        data: { user: social_id_user, isNewUser: false }
                    }
                } else {
                    return {
                        status: false,
                        message: 'You are blocked. Please contact admin'
                    }
                }
            }
            //regsiter case with facebook 1st time
            const _createUser = await db.User.create(req.body)
            if (_createUser) {
                const user = await db.User.findOne({ where: { id: _createUser.id } })
                const token = await generateAccessToken(user)
                user.auth_token = token
                user.login_token = token
                await db.User.update({ auth_token: token, login_token: token, fcm_token: fcm_token, is_verified: false }, { where: { id: _createUser.id } })
                return {
                    status: true,
                    message: 'User signed up successfully with Facebook',
                    data: { user: user, isNewUser: true }
                }
            }
            return {
                status: false,
                message: 'Something went wrong. Please try again later.'
            }
        } else {
            return {
                status: false,
                message: 'Something went wrong. Please try again later.'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const socaiLoginUser = async (userBySocialId, fcm_token, platform) => {
    const token = await generateAccessToken(userBySocialId)
    userBySocialId.profile_image = userBySocialId?.profile_image ? userBySocialId.profile_image : 'gamba.png'
    userBySocialId.auth_token = token
    userBySocialId.login_token = token
    userBySocialId.fcm_token = fcm_token
    if (platform == 'web') {
        await db.User.update({ auth_token: token, login_token: token }, { where: { id: userBySocialId.id } })
    } else {
        await db.User.update({ auth_token: token, login_token: token, fcm_token: fcm_token, badge_count: 0 }, { where: { id: userBySocialId.id } })
    }
    return userBySocialId
}

//delete user from admin panel
const deleteUser = async (req) => {
    try {
        // const u_id = await getUserIdFromToken(req)
        const { userId } = req.query
        let user = await db.User.findOne({ where: { id: userId } })
        if (user) {
            const event = await db.Events.findAll({ where: { u_id: userId } })
            // for (let i = 0; i < event.length; i++) {
            //     event[i].photos?.length ? await deleteMultipleImage(event[i].photos) : ''
            //     await db.EventCategory.destroy({where: {event_id: event[i].id}})
            //     await db.EventParticipents.destroy({where: {event_id: event[i].id}})
            // }
            // const response = await Promise.all([db.Events.destroy({where: {u_id: userId}}), db.User.destroy({where: {id: userId}})])
            //     .then((res) => {
            //         return res
            //     })
            //     .catch((err) => {
            //         console.log('NOT DELETED')
            //     })
            // if (!response[5]) {
            //     return {
            //         status: false,
            //         message: 'Something went wrong. Please try again later.'
            //     }
            // }
            user.profile_image != 'gamba.png' ? await deleteImage(user.profile_image) : ''

            return {
                status: true,
                message: 'User account has been successfully deleted.'
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

const viewAllUser = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        const users = await db.User.findAndCountAll({
            attributes: { exclude: ['password', 'login_token', 'auth_token', 'verification_code'] },
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset
        })
        let all_user_count = await db.User.count({
            where: {
                is_block: false
            }
        })
        let block_user_count = await db.User.count({
            where: {
                is_block: true
            }
        })
        let disable_user_count = await db.User.count({
            where: {
                disable: true
            }
        })
        let deleted_user_count = await db.User.count({
            where: {
                is_deleted: true
            }
        })
        const remainingCount = users?.count - (offset + users?.rows.length)
        if (users) {
            return {
                status: true,
                message: `All users`,
                data: { all_users: users.rows, count: users.count, remaining: remainingCount, page: req.query.page, all_user_count, block_user_count, disable_user_count: disable_user_count, deleted_user_count }
            }
        } else {
            return {
                status: false,
                message: 'Something went wrong. Please try again later.'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// Send Register Code
const sendRegisterCode = async (req) => {
    try {
        const { email, phone } = req.body
        const user = await db.User.findOne({ where: { [db.Op.or]: [{ email: { [db.Op.eq]: `${email}` } }, { phone: { [db.Op.eq]: `${phone}` } }] } })
        if (user) {
            const code = user.verification_code
            if (email) {
                const sendEmail = verificationCodeEmail(code, email)
                if (sendEmail) {
                    return {
                        status: true,
                        message: 'Verification code sent successfully'
                    }
                }
            }
            return {
                status: false,
                message: 'email nnot found'
            }
        }
        return {
            status: false,
            message: 'Wrong phone number.'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// Send Verification Code
//ahad
const sendVerificationCode = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { email, two_fector_auth } = req.body
        const code = await randomCode()

        let user = await db.User.findOne({ where: { email: email } })
        if (two_fector_auth) {
            let check_setting_for_two_fector = await db.notificationSetting.findOne({
                where: {
                    u_id: user.id
                }
            })

            if (check_setting_for_two_fector?.two_fector_auth == true) {
                // let code = 112233

                await db.User.update(
                    {
                        verification_code: code,
                        two_fector_auth: false,
                        two_fector_auth_check_detail: true
                    },
                    {
                        where: {
                            id: user.id
                        }
                    }
                )
                user = await db.User.findOne({ where: { email: email } })
                let info = await verificationCodeEmail(user.verification_code, user.email)
                if (info) {
                    return {
                        status: true,
                        message: 'Verification code sent successfully'
                    }
                }
            }
        } else {
            let user = await db.User.findOne({ where: { email: email } })
            if (user) {
                // const code = await randomCode()
                // const code = 123000

                const update_user = await db.User.update({ verification_code: code }, { where: { id: user.id } })
                if (update_user) {
                    const sendEmail = verificationCodeEmail(code, email)
                    if (sendEmail) {
                        return {
                            status: true,
                            message: 'Verification code sent successfully'
                        }
                    }
                }
            }
        }
        return {
            status: false,
            message: 'email not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// Verify registration code
//wwww
const verfyRegisterCode = async (req) => {
    try {
        const { email, verification_code, two_fector_auth } = req.body

        if (two_fector_auth) {
            const user = await db.User.findOne({ where: { email: email } })
            if (user) {
                const verifyCode = await db.User.findOne({ where: { email: email, verification_code: verification_code } })
                const alreadyVerified = await db.User.findOne({ where: { email: email, two_fector_auth: true } })
                if (alreadyVerified) {
                    return {
                        status: false,
                        message: 'User already verified, Please login'
                    }
                }

                if (verifyCode) {
                    let update_user = await db.User.update({ two_fector_auth: true }, { where: { id: user.id } })
                    update_user = await db.User.findOne({ where: { id: user.id } })
                    if (update_user) {
                        return {
                            status: true,
                            message: `Two Factor-Auth verified successfully`,
                            data: update_user
                        }
                    }
                }
                return {
                    status: false,
                    message: 'Wrong verification code'
                }
            }
        } else {
            let popup = []
            const user = await db.User.findOne({ where: { email: email } })
            if (user) {
                const verifyCode = await db.User.findOne({ where: { email: email, verification_code: verification_code } })
                const alreadyVerified = await db.User.findOne({ where: { email: email, is_verified: true } })
                if (alreadyVerified) {
                    return {
                        status: false,
                        message: 'User already verified, Please login'
                    }
                }

                if (verifyCode) {
                    const update_user = await db.User.update({ is_verified: true }, { where: { id: user.id } })
                    if (update_user) {
                        return {
                            status: true,
                            message: `User verified successfully`,
                            data: { popUp: popup }
                        }
                    }
                }
                return {
                    status: false,
                    message: 'Wrong verification code'
                }
            }
            return {
                status: false,
                message: 'User with this email not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// Verify verification code.. for password reset verificaiton
const resetPassword = async (req) => {
    try {
        const { email } = req.body
        const user = await db.User.findOne({ where: { email: email } })
        if (user) {
            // let randomPassword = Math.floor(10000000 + Math.random() * 9000000)
            // // let randomPassword = 87654321
            // const id = user.id
            // const bcryptPassword = await hashPassword(JSON.stringify(randomPassword))
            // let update_user = await db.User.update({ password: bcryptPassword }, { where: { id: id } })

            // if (user?.phone) {
            //     await resetAccountPassword(user?.phone, randomPassword)
            // }
            await resetPasswordEmail(user)
            if (user) {
                return {
                    status: true,
                    message: `A link sent to your email`
                }
            }
        }
        return {
            status: false,
            message: 'Invalid email address.'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// Update password
const updatePassword = async (req) => {
    try {
        const { userId } = req.params
        const { password } = req.body
        const bcryptPassword = await hashPassword(password)
        const user = await db.User.findOne({ where: { id: userId } })
        if (user) {
            const update_user = await db.User.update(
                { password: bcryptPassword },
                {
                    where: {
                        id: userId
                    }
                }
            )

            await passwordUpdated(user)
            if (update_user) {
                return {
                    status: true,
                    message: `Password changed successfully`
                }
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

const randomCode = async () => {
    // let random = 123456
    // return random
    return Math.floor(100000 + Math.random() * 900000)
}

function containsWhitespace(str) {
    return /\s/.test(str)
}

// search by user name
const searchByName = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let { name, chat } = req.body
        let matchedUsers = []
        if (containsWhitespace(name)) {
            const newName = name.split(' ')
            let fill_name = newName[0]
            matchedUsers = await db.sequelize.query(`select * from users where (fill_name like :fill_name or (home_location = '1' and location like :query)) and id != :id and is_verified = :is_verified`, { replacements: { fill_name: `${fill_name}`, query: `${name}`, id: `${u_id}`, is_verified: true }, type: db.QueryTypes.SELECT })
        } else {
            name = '%' + name + '%'
            matchedUsers = await db.sequelize.query(`select * from users where (user_name like :query or fill_name like :query or (home_location = '1' and location like :query)) and id != :id and is_verified = :is_verified`, { replacements: { query: `${name}`, id: `${u_id}`, is_verified: true }, type: db.QueryTypes.SELECT })
        }
        const users = []
        for (let i = 0; i < matchedUsers.length; i++) {
            if (matchedUsers[i].id != u_id && matchedUsers[i]?.parse_objId == null && chat) {
                let user = await matchUserChatTrue(matchedUsers[i], u_id)
                if (user) {
                    users.push(user)
                }
            } else if (matchedUsers[i].id != u_id && !chat) {
                let user = await matchUserChatTrue(matchedUsers[i], u_id)
                if (user) {
                    users.push(user)
                }
            }
        }
        return {
            status: true,
            message: `Matched users`,
            data: {
                users: users
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const matchUserChatTrue = async (user, id) => {
    let is_blocked = await blockedUser(id, user.id)
    if (!is_blocked) {
        user.auth_token = ''
        user.login_token = ''
        user.password = ''
        return user
    } else {
        return null
    }
}

const getAllNotification = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const user = await db.User.findOne({ where: { id: u_id } })
        let notificationArray = await getUserNotificationsArray(u_id)
        let oldNotifications = await getOldNotificatins(u_id, notificationArray, user?.last_viewed)
        let newNotifications = await getNewNotificatins(u_id, notificationArray, user?.last_viewed)
        let allNotifications = newNotifications.concat(oldNotifications)
        await db.User.update({ last_viewed: new Date() }, { where: { id: u_id } })
        return {
            status: true,
            message: 'All notifications',
            data: { notifications: allNotifications }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getUserNotificationsArray = async (u_id) => {
    let notificationArray = []
    const userNotification = await db.UserNotification.findOne({ where: { u_id: u_id } })
    if (userNotification) {
        if (userNotification?.circle_add_favotite) {
            notificationArray.push(NotificationEnum.ADD_FAV_RESTAURANT)
        }
        if (userNotification?.like_my_gamba) {
            notificationArray.push(NotificationEnum.LIKE_GAMBA)
        }
        if (userNotification?.comment_my_gamba) {
            notificationArray.push(NotificationEnum.COMMENT_GAMBA)
        }
        if (userNotification?.bookmark_my_gamba) {
            notificationArray.push(NotificationEnum.SAVED_GAMBA)
        }
        if (userNotification?.invite_gamba) {
            notificationArray.push(NotificationEnum.INIVITE)
        }
        if (userNotification?.someone_follow) {
            notificationArray.push(NotificationEnum.FOLLOW)
        }
        if (userNotification?.share_my_gamba) {
            notificationArray.push(NotificationEnum.SHARE)
        }
        if (userNotification?.circle_add_gamba) {
            notificationArray.push(NotificationEnum.ADD_GAMBA)
        }
        if (userNotification?.circle_update_gamba) {
            notificationArray.push(NotificationEnum.UPDATE_GAMBA)
        }
    }
    return notificationArray
}

const getOldNotificatins = async (u_id, notificationArray, last_viewed) => {
    let allNotifications = []
    const ownOldNotifications = await db.FcmNotification.findAll({ where: { f_id: u_id, type: { [db.Op.in]: notificationArray }, createdAt: { [db.Op.lt]: new Date(last_viewed), [db.Op.gt]: new Date(new Date(last_viewed) - 24 * 60 * 60 * 1000) } } })
    ownOldNotifications.sort((a, b) => {
        if (a.createdAt < b.createdAt) return 1
        if (a.createdAt > b.createdAt) return -1
        return 0
    })
    for (let i = 0; i < ownOldNotifications.length; i++) {
        const data = await modifyUserNotifications(ownOldNotifications[i], true, u_id)
        if (data) {
            allNotifications.push(data)
        }
    }
    return allNotifications
}

const getNewNotificatins = async (u_id, notificationArray, last_viewed) => {
    let allNotifications = []
    const ownNewNotifications = await db.FcmNotification.findAll({ where: { f_id: u_id, type: { [db.Op.in]: notificationArray }, createdAt: { [db.Op.lt]: new Date(), [db.Op.gt]: new Date(last_viewed) } } })
    ownNewNotifications.sort((a, b) => {
        if (a.createdAt < b.createdAt) return 1
        if (a.createdAt > b.createdAt) return -1
        return 0
    })
    for (let i = 0; i < ownNewNotifications.length; i++) {
        const data = await modifyUserNotifications(ownNewNotifications[i], false, u_id)
        if (data) {
            allNotifications.push(data)
        }
    }
    return allNotifications
}

const modifyUserNotifications = async (notifications, is_read, u_id) => {
    const user = await db.User.findOne({ where: { id: notifications.u_id } })
    let is_blocked = await blockedUser(u_id, notifications.u_id)
    let newMessage = u_id == JSON.parse(notifications.f_id) ? await modifyMessage(notifications) : notifications.message
    if (user && !is_blocked) {
        let data = {
            name: user.first_name + ' ' + user.last_name,
            image: user.profile_image,
            message: newMessage,
            u_id: notifications.u_id,
            r_id: notifications.r_id,
            r_title: notifications.r_title,
            b_id: notifications.b_id,
            type: notifications.type,
            time: notifications.createdAt,
            is_read: is_read
        }
        return data
    } else {
        return null
    }
}

const modifyMessage = async (notification) => {
    if (notification.type == NotificationEnum.LIKE_GAMBA) {
        let message = `liked your prifile`
        return message
    } else if (notification.type == NotificationEnum.COMMENT_GAMBA) {
        let message = `commented on your prifile`
        return message
    } else if (notification.type == NotificationEnum.SAVED_GAMBA) {
        let message = `saved your prifile`
        return message
    } else if (notification.type == NotificationEnum.SHARE) {
        let message = `shared your prifile`
        return message
    } else if (notification.type == NotificationEnum.FOLLOW) {
        let message = `is now following you`
        return message
    } else {
        return notification.message
    }
}

const sendChatFcm = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let { users, text } = req.body
        users = JSON.parse(users)
        const sender = await db.User.findOne({ where: { id: u_id } })
        for (let index = 0; index < users.length; index++) {
            let receieverId = users[index]?.replace('G', '')
            const reciver = await db.User.findOne({ where: { id: receieverId } })
            let is_blocked = await blockedUser(u_id, reciver?.id)
            if (reciver?.fcm_token && !is_blocked) {
                let message = {
                    token: reciver?.fcm_token,
                    notification: {
                        title: `${sender.first_name} ${sender.last_name} sent you a message`,
                        body: text
                    },
                    data: { u_id: JSON.stringify(u_id), f_id: users[index], type: 'chat' },
                    apns: {
                        payload: {
                            aps: {
                                badge: reciver?.badge_count + 1
                            }
                        }
                    }
                }
                await db.User.update({ badge_count: reciver?.badge_count + 1 }, { where: { id: reciver.id } })
                sendNotification(message)
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteUserAllData = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let user = await db.User.findOne({ where: { id: u_id } })
        if (user) {
            const event = await db.Events.findAll({ where: { u_id: u_id } })
            for (let i = 0; i < event.length; i++) {
                event[i].photos?.length ? await deleteMultipleImage(event[i].photos) : ''
                await db.EventCategory.destroy({ where: { event_id: event[i].id } })
                await db.EventParticipents.destroy({ where: { event_id: event[i].id } })
            }
            const response = await Promise.all([db.Events.destroy({ where: { u_id: u_id } }), db.User.destroy({ where: { id: u_id } })])
                .then((res) => {
                    return res
                })
                .catch((err) => {
                    console.log('NOT DELETED')
                })
            user.profile_image?.length ? await deleteMultipleImage(user.profile_image) : await deleteImage(user.profile_image)

            if (!response[5]) {
                return {
                    status: false,
                    message: 'Something went wrong. Please try again later.'
                }
            }
            return {
                status: true,
                message: 'Your account has been successfully deleted.'
            }
        }
        return {
            status: false,
            message: 'User account not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const facetStage = async (pageNumber) => {
    const limit = 15 // set limit per page
    const page = pageNumber ? parseInt(pageNumber) : 1 // get page number from user
    const offset = page ? (page - 1) * limit : 0 // number of page multiply py limit
    return { limit, offset }
}

const autoCreate = async () => {
    const admin = await db.Admin.findOne({ where: { email: 'ronitmory@gmail.com' } })
    if (!admin) {
        let createAdmin = await db.Admin.create({ email: 'ronitmory@gmail.com', password: await hashPassword('Gamba.earth!@#$') })
        const token = await generateAccessToken(createAdmin, true)
        await db.Admin.update({ login_token: token }, { where: { email: 'ronitmory@gmail.com' } })
    }
}

const blockedUser = async (u_id, f_id) => {
    // const is_blocked_admin = await db.User.findOne({where: {id: f_id, blocked: true}})
    // const user = await db.BlockUser.findOne({where: {u_id: u_id, f_id: f_id}})
    // const is_blocked_me = await db.BlockUser.findOne({where: {u_id: f_id, f_id: u_id}})
    // if (is_blocked_admin) {
    //     return true
    // } else if (is_blocked_me) {
    //     return true
    // } else if (user) {
    //     return true
    // } else {
    //     return false
    // }

    return false
}

const getUserById = async (req) => {
    try {
        const { id } = await req.query
        let user = await db.User.findOne({
            where: { id: id }
        })
        if (user) {
            user.password = ''
            return {
                status: true,
                message: `User data`,
                data: user
            }
        }
        return {
            status: false,
            message: `User not found`
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

//zzzz
const getAllSellers = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { limit, offset } = await facetStage(req.query.page)
    const is_organic = req.query.is_organic
    const currentDate = moment().format('MM/DD/YY')
    let sellerIds = await db.UserProducts.findAll({
        // where: {quantity: {[db.Op.gte]: 0}},
        attributes: ['u_id'],
        raw: true
    })

    sellerIds = sellerIds?.length ? sellerIds.map((e) => e.u_id) : []

    //hide seller array data
    let seller_data = await db.hideSeller.findAll({
        where: {
            u_id: u_id
        }
    })
    let seller_id_data = []
    seller_id_data = seller_data?.length ? seller_data.map((d) => d.seller_id) : []
    let allSellers
    let where = is_organic == 'false' ? { [db.Op.and]: [{ id: { [db.Op.in]: sellerIds } }, { id: { [db.Op.notIn]: [...seller_id_data, u_id] } }] } : { [db.Op.and]: [{ id: { [db.Op.notIn]: [...seller_id_data, u_id] } }] }

    allSellers = await db.User.findAll({
        where: {
            ...where,
            disable: false,
            is_block: false
        },
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM ratings WHERE seller = user.id)`), 'count'],
                [db.sequelize.literal(`(SELECT AVG(rating) FROM ratings WHERE seller = user.id)`), 'avg'],
                [db.sequelize.col('address'), 'location'],
                [db.sequelize.literal(`CASE WHEN EXISTS(SELECT 1 FROM favoriteSellers WHERE favoriteSellers.seller_id = user.id AND favoriteSellers.u_id = ${u_id}) THEN TRUE ELSE FALSE END`), 'isFev']
            ],
            exclude: ['password', 'auth_token', 'login_token', 'social_id', 'createdAt', 'updatedAt', 'fcm_token', 'verification_code']
        },
        include: [
            {
                model: db.UserProducts,
                association: 'userProducts',
                where: {
                    [db.Op.or]: [
                        {
                            available_to: {
                                [db.Op.gte]: currentDate
                            },
                            isUnlimitted: false
                        },
                        { isUnlimitted: true }
                    ],
                    available_from: {
                        [db.Op.lte]:
                            db.sequelize.literal(`
                    CASE
                        WHEN userProducts.id = userProducts.id AND userProducts.allow_to_0rder_advance > 0 THEN
                            CASE
                                WHEN userProducts.allow_to_0rder = 'Hour(s)' THEN
                                    DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProducts.allow_to_0rder_advance HOUR), '%m/%d/%y')
                                ELSE
                                    DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProducts.allow_to_0rder_advance DAY), '%m/%d/%y')
                            END
                        ELSE '${currentDate}'
                    END
                `)
                    },
                },
                attributes: {
                    include: [
                        [db.sequelize.literal(`EXISTS(SELECT * FROM favorites WHERE product_id = userProducts.id AND u_id = ${u_id})`), 'isFev'],
                        [db.sequelize.literal(`(SELECT COUNT(*) FROM shareModels WHERE product_id = userProducts.id)`), 'total_share_count']
                    ]
                },

                include: [
                    {
                        association: 'trade'
                    },
                    {
                        association: 'category'
                    },
                    {
                        association: 'chemicall'
                    },
                    {
                        association: 'fev-product'
                    },
                    {
                        association: 'chemical_data',

                        include: [
                            {
                                association: 'chemical_data_detail'
                            }
                        ]
                    },
                    {
                        association: 'user',
                        attributes: ['id', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
                    }
                ]
                // offset: offset,
                // limit: limit
                // order: [['userProducts.createdAt', 'DESC']]
                //attributes: ['id', [db.sequelize.literal(`EXISTS(SELECT * FROM favorites WHERE product_id = userProducts.id AND u_id = ${u_id})`), 'isFev']]
            }
        ],
        order: [[{ model: db.UserProducts, as: 'userProducts' }, 'createdAt', 'DESC']],
        offset: offset,
        limit: limit
    })

    return {
        data: { allSellers },
        status: true,
        message: `View all sellers`
    }
}

const searchSellers = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { limit, offset } = await facetStage(req.query.page)
    const filter = req.query.filter
    const words = filter.split(' ')
    const firstWordAfterSpace = words[0]

    //seller that have product
    let sellerIds = await db.UserProducts.findAll({
        // where: {quantity: {[db.Op.gte]: 0}},
        attributes: ['u_id'],
        raw: true
    })

    sellerIds = sellerIds?.length ? sellerIds.map((e) => e.u_id) : []

    //hide seller
    let seller_data = await db.hideSeller.findAll({
        where: {
            u_id: u_id
        }
    })
    let seller_id_data = []
    seller_id_data = seller_data?.length ? seller_data.map((d) => d.seller_id) : []
    const searchSellers = await db.User.findAll({
        where: {
            [db.Op.or]: [
                {
                    [db.Op.or]: [
                        {
                            first_name: {
                                [db.Op.like]: '%' + filter + '%'
                            }
                        },
                        {
                            first_name: {
                                [db.Op.like]: '%' + firstWordAfterSpace + '%'
                            }
                        }
                    ]
                },

                {
                    last_name: {
                        [db.Op.like]: '%' + filter + '%'
                    }
                }
            ],
            id: { [db.Op.notIn]: [...seller_id_data, u_id], [db.Op.in]: sellerIds },
            disable: false,
            is_block: false
        },
        attributes: {
            include: [[db.sequelize.literal(`CASE WHEN EXISTS(SELECT 1 FROM favoriteSellers WHERE favoriteSellers.seller_id = user.id AND favoriteSellers.u_id = ${u_id}) THEN TRUE ELSE FALSE END`), 'isFev']],
            exclude: ['password', 'verification_code', 'login_token', 'auth_token']
        },
        include: [
            {
                association: 'userProducts',
                attributes: {
                    include: [
                        [db.sequelize.literal(`COALESCE((SELECT SUM(quantity)FROM soldProducts WHERE product_id = userProductGood.id),0)`), 'totalSold']
                    ]
                },
                include: [
                    {
                        association: 'trade'
                    },
                    {
                        association: 'category'
                    },
                    {
                        association: 'chemicall'
                    },
                    {
                        association: 'fev-product'
                    },
                    {
                        association: 'chemical_data',

                        include: [
                            {
                                association: 'chemical_data_detail'
                            }
                        ]
                    },
                    {
                        association: 'user',
                        attributes: ['id', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
                    }
                ]
            },

        ],
        offset: offset,
        limit: limit
    })

    return {
        data: searchSellers,
        status: true,
        message: `search all sellers`
    }
}

const getUserWMaxPosts = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { limit, offset } = await facetStage(req.query.page)
        let seller_data = await db.hideSeller.findAll({
            where: {
                u_id: u_id
            }
        })
        let seller_id_data = []
        seller_id_data = seller_data?.length ? seller_data.map((d) => d.seller_id) : []
        const topUserPosts = await db.User.findAll({
            attributes: [
                'id',
                'first_name',
                'last_name',
                'image',
                'chat_id',
                'display_phone',
                'display_email',
                'display_dob',
                'display_location',
                'display_profile',
                'display_dob_full_format',
                'lat',
                'log',
                [
                    db.sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM userPosts
                    WHERE userPosts.u_id = user.id
                )`),
                    'postCount'
                ],
                [db.sequelize.literal(`CASE WHEN EXISTS(SELECT 1 FROM favoriteSellers WHERE favoriteSellers.seller_id = user.id AND favoriteSellers.u_id = ${u_id}) THEN TRUE ELSE FALSE END`), 'isFev']
            ],
            where: {
                // id: {
                //     [db.Op.ne]: u_id
                // },
                disable: false,
                is_block: false,
                [db.Op.and]: [{ id: { [db.Op.ne]: u_id } }, { id: { [db.Op.notIn]: seller_id_data } }]
            },

            order: [[db.sequelize.literal('PostCount'), 'DESC']],
            offset: offset,
            limit: limit
        })

        return {
            data: topUserPosts,
            status: true,
            message: `Top Users by Posts`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const topSeller = async (req) => {
    const u_id = await getUserIdFromToken(req)

    let seller_data = await db.hideSeller.findAll({
        where: {
            u_id: u_id
        }
    })
    let seller_id_data = []
    seller_id_data = seller_data?.length ? seller_data.map((d) => d.seller_id) : []

    let sellerIds = await db.UserProducts.findAll({
        where: { quantity: { [db.Op.gte]: 0 } },
        attributes: ['u_id'],
        raw: true
    })

    sellerIds = sellerIds?.length ? sellerIds.map((e) => e.u_id) : []

    const allSellers = await db.User.findAll({
        // where: {id: {[db.Op.in]: sellerIds}},
        attributes: {
            include: [
                //  [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalSum'],
                //[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'totalSum'],
                //[db.sequelize.literal(`(SELECT SUM(*) FROM ratings WHERE seller = user.id)`), 'sum'],
                [db.sequelize.literal(`(SELECT COUNT(*) FROM ratings WHERE seller = user.id)`), 'count'],
                [db.sequelize.literal(`(SELECT AVG(rating) FROM ratings WHERE seller = user.id)`), 'avg'],
                [db.sequelize.literal(`(SELECT COUNT(*) FROM soldProducts WHERE seller_id = user.id)`), 'sold_product_count'],
                [db.sequelize.literal(`(SELECT COUNT(*) FROM userProfileLikes WHERE f_id = user.id )`), 'profile_likes'],
                [db.sequelize.literal(`(SELECT COUNT(*) FROM userProfileDislikes WHERE f_id = user.id)`), 'profile_dislikes'],

                [db.sequelize.literal(`EXISTS(SELECT * FROM userProfileLikes WHERE f_id = user.id AND u_id = ${u_id})`), 'isLiked'],
                [db.sequelize.literal(`EXISTS(SELECT * FROM userProfileDislikes WHERE f_id = user.id AND u_id = ${u_id})`), 'isDisLiked'],

                'lat',
                'log',
                'chat_id',
                'display_phone',
                'display_email',
                'display_dob',
                'display_location',
                'display_profile',
                'display_dob_full_format',
                [db.sequelize.literal(`CASE WHEN EXISTS(SELECT 1 FROM favoriteSellers WHERE favoriteSellers.seller_id = user.id AND favoriteSellers.u_id = ${u_id}) THEN TRUE ELSE FALSE END`), 'isFev']
                // [db.sequelize.literal('(SELECT COUNT(*) FROM soldProducts WHERE seller_id = user.id AND COUNT >0)')]
            ],
            exclude: ['email', 'password', 'auth_token', 'login_token', 'social_id', 'fcm_token', 'phone', 'verification_code', 'dob', 'about', 'createdAt', 'updatedAt', 'count', 'avg']
        },

        // include: [
        //     {
        //         association: 'userProducts'
        //     }
        // ],
        where: { id: { [db.Op.in]: sellerIds }, is_block: false, disable: false, id: { [db.Op.notIn]: [...seller_id_data, u_id] } },

        // where: {
        //     [db.Op.and]: [{id: {[db.Op.in]: sellerIds}}, {id: {[db.Op.notIn]: seller_id_data}},{ is_block: {false}],
        // },
        order: [[db.sequelize.literal('sold_product_count'), 'DESC']],
        having: { sold_product_count: { [db.Op.gt]: 0 } }
    })

    const topSeller = allSellers.slice(0, 10)

    return {
        data: { topSeller },
        status: true,
        message: `View all sellers`
    }
}

const updateUserPassword = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)

        const { previousPassword, newPassword, isUpdate } = req.body

        const user = await db.User.findOne({ where: { id: u_id } })
        if (user) {
            let checkPassword = await comparePassword(previousPassword, user.password)

            const bcryptPassword = await hashPassword(newPassword)
            if (isUpdate) {
                let checkPassword = await comparePassword(newPassword, user.password)
                if (checkPassword) {

                    return {
                        status: false,
                        message: 'new password must be differnt then old one '
                    }
                }
                await db.User.update(
                    {
                        password: bcryptPassword
                    },
                    {
                        where: {
                            id: user.id
                        }
                    }
                )
                return {
                    status: true,
                    message: 'Password is Updated'
                }
            }
            if (checkPassword) {
                if (previousPassword == newPassword) {
                    return {
                        status: false,
                        message: 'new password must be differnt then old one '
                    }
                }
                await db.User.update(
                    {
                        password: bcryptPassword
                    },
                    {
                        where: {
                            id: user.id
                        }
                    }
                )
                return {
                    status: true,
                    message: 'Password is Updated'
                }
            } else {
                return {
                    status: false,
                    message: 'Previous Password is not correct'
                }
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getSellerById = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { limit, offset } = await facetStage(req.query.page)
    const { seller_id } = req.body
    const currentDate = moment().format('MM/DD/YY')
    let sellerIds = seller_id

    const allSellers = await db.User.findOne({
        where: { id: sellerIds },
        attributes: {
            include: [
                //  [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalSum'],

                [db.sequelize.literal(`(SELECT COUNT(*) FROM ratings WHERE seller = user.id)`), 'count'],
                [db.sequelize.literal(`(SELECT AVG(rating) FROM ratings WHERE seller = user.id)`), 'avg'],
                // [db.sequelize.col('address'), 'location'],
                [db.sequelize.literal(`CASE WHEN EXISTS(SELECT 1 FROM favoriteSellers WHERE favoriteSellers.seller_id = user.id AND favoriteSellers.u_id = ${u_id}) THEN TRUE ELSE FALSE END`), 'isFev']
            ],
            exclude: ['password', 'auth_token', 'login_token', 'social_id', 'createdAt', 'updatedAt', 'fcm_token', 'verification_code']
        },
        include: [
            {
                model: db.UserProducts,
                association: 'userProducts',

                required: false,

                where: {
                    [db.Op.or]: [
                        {
                            available_to: {
                                [db.Op.gte]: currentDate
                            },
                            isUnlimitted: false
                        },
                        { isUnlimitted: true }
                    ],
                    available_from: {
                        [db.Op.lte]:
                            db.sequelize.literal(`
                    CASE
                        WHEN userProducts.id = userProducts.id AND userProducts.allow_to_0rder_advance > 0 THEN
                            CASE
                                WHEN userProducts.allow_to_0rder = 'Hour(s)' THEN
                                    DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProducts.allow_to_0rder_advance HOUR), '%m/%d/%y')
                                ELSE
                                    DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProducts.allow_to_0rder_advance DAY), '%m/%d/%y')
                            END
                        ELSE '${currentDate}'
                    END
                `)
                    },
                    is_block: false
                },

                attributes: {
                    include: [
                        [db.sequelize.literal(`EXISTS(SELECT * FROM favorites WHERE product_id = userProducts.id AND u_id = ${u_id})`), 'isFev'],
                        [db.sequelize.literal(`COALESCE((SELECT SUM(quantity)FROM soldProducts WHERE product_id = userProducts.id),0)`), 'totalSold']
                    ]
                },
                include: [
                    {
                        association: 'trade',
                        required: false
                    },
                    {
                        association: 'category',
                        required: false
                    },
                    {
                        association: 'chemicall',
                        required: false
                    },
                    {
                        association: 'fev-product',
                        required: false
                    },
                    {
                        association: 'chemical_data',
                        required: false,

                        include: [
                            {
                                association: 'chemical_data_detail',
                                required: false
                            }
                        ]
                    },
                    {
                        model: db.User,
                        association: 'user',
                        required: false,
                        attributes: ['id', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
                    }
                ]
                // subQuery: false,
                // limit: limit,
                // offset: offset
            }
        ]
    })

    return {
        data: { allSellers },
        status: true,
        message: `View all sellers`
    }
}
const contectUs = async (req) => {
    try {
        const { first_name, last_name, email, phone, subject, message } = req.body
        let newContect = await db.contectUs.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone: phone,
            subject: subject,
            message: message
        })

        return {
            data: newContect,
            status: true,
            message: `Your Request is save `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}
const getContectUs = async (req) => {
    try {
        let response = await db.contectUs.findAll({})
        return {
            data: response,
            status: true,
            message: `all Contect Details `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const notification = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let response = await db.notification.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    association: 'user_data_notification',
                    attributes: ['id', 'first_name', 'last_name', 'image']
                },
                {
                    association: 'post_data_notification'
                },
                {
                    association: 'product_detail_notification'
                }
            ],

            where: {
                f_id: u_id
            }
        })
        // await db.notification.update(
        //     {
        //         is_read: true
        //     },
        //     {
        //         where: {
        //             f_id: u_id
        //         }
        //     }
        // )
        return {
            data: response,
            status: true,
            message: `My All Notification `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

//read single notification
const readNotification = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const id = req.query.id
        await db.notification.update(
            {
                is_read: true
            },
            {
                where: {
                    id: id
                }
            }
        )

        let response = await db.notification.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    association: 'user_data_notification',
                    attributes: ['id', 'first_name', 'last_name', 'image']
                },
                {
                    association: 'post_data_notification'
                },
                {
                    association: 'product_detail_notification'
                }
            ],

            where: {
                f_id: u_id
            }
        })

        return {
            data: response,
            status: true,
            message: `My All Notification `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

//marke as read all notifications
const markAllReadnotification = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        await db.notification.update(
            {
                is_read: true
            },
            {
                where: {
                    f_id: u_id
                }
            }
        )

        let response = await db.notification.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    association: 'user_data_notification',
                    attributes: ['id', 'first_name', 'last_name', 'image']
                },
                {
                    association: 'post_data_notification'
                },
                {
                    association: 'product_detail_notification'
                }
            ],

            where: {
                f_id: u_id
            }
        })

        return {
            data: response,
            status: true,
            message: `My All Notification `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const hideSellerProfile = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { seller_id } = req.body
    try {
        let hideSellerProfile = await db.hideSeller.create({
            seller_id: seller_id,
            u_id: u_id
        })

        //hide seller post
        let hideAllPostSeller = await db.Posts.findAll({
            where: {
                u_id: seller_id
            },
            attributes: ['id'],
            raw: true
        })
        //console.log('hideAllPostSeller', hideAllPostSeller)
        hideAllPostSeller = hideAllPostSeller?.length ? hideAllPostSeller.map((e) => e.id) : []

        if (hideAllPostSeller.length > 0) {
            await db.hidePost.bulkCreate(
                hideAllPostSeller.map((postId) => ({
                    u_id: u_id,
                    post_id: postId
                }))
            )
        }
        //hide seller events

        let hideAllEventSeller = await db.Events.findAll({
            where: {
                u_id: seller_id
            },
            attributes: ['id'],
            raw: true
        })

        hideAllEventSeller = hideAllEventSeller?.length ? hideAllEventSeller.map((d) => d.id) : []

        if (hideAllEventSeller.length > 0) {
            await db.hideEvent.bulkCreate(
                hideAllEventSeller.map((eventId) => ({
                    u_id: u_id,
                    event_id: eventId
                }))
            )
        }

        return {
            data: hideSellerProfile,
            status: true,
            message: `Seller is Hide `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const SellerOrderData = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)

        let product_id = await db.Orders.findAll({
            where: { seller_id: u_id },
            attributes: ['product_id'],
            raw: true
        })

        product_id = product_id?.length ? product_id.map((e) => e.product_id) : []

        const response = await db.UserProducts.findAll({
            attributes: {
                include: [
                    [db.sequelize.literal('(SELECT SUM(quantity) FROM soldProducts where userProductGood.id= soldProducts.product_id )'), 'total_sold'],

                    [db.sequelize.literal(`EXISTS(SELECT * FROM favorites WHERE product_id = userProductGood.id AND u_id = ${u_id})`), 'isFev'],
                    [db.sequelize.literal(`COALESCE((SELECT SUM(quantity)FROM soldProducts WHERE product_id = userProductGood.id),0)`), 'totalSold']
                ]
            },
            order: [['createdAt', 'DESC']],

            include: [
                {
                    association: 'trade'
                },
                {
                    association: 'category'
                },
                {
                    association: 'chemicall'
                },
                {
                    association: 'fev-product'
                },
                {
                    association: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
                },
                {
                    association: 'chemical_data',

                    include: [
                        {
                            association: 'chemical_data_detail'
                        }
                    ]
                }
                //{model: db.ProductChemical, as: 'productChemicals'}
            ],
            where: {
                u_id: u_id,
                id: { [db.Op.in]: product_id }
            }
        })

        // const response = await db.UserProducts.findAll({
        //     order: [['createdAt', 'DESC']],
        //     include: [
        //         {
        //             association: 'order',
        //             attributes: [[db.sequelize.literal('(SELECT SUM(quantity) FROM soldProducts)'), 'total_sum']],
        //             include: [
        //                 {
        //                     association: 'order_products',
        //                     include: [
        //                         {
        //                             association: 'user_orders',
        //                             attributes: ['id', 'first_name', 'last_name', 'image']
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }
        //     ],
        //     where: {
        //         u_id: u_id,
        //         '$order.id$': {
        //             [db.Op.ne]: null
        //         }
        //     }
        // })

        // const response = await db.Checkout.findAll({
        //     order: [['createdAt', 'DESC']],
        //     include: [
        //         {
        //             association: 'order_products',
        //             include: [{association: 'product_orders'}]
        //         },
        //         {
        //             association: 'user_orders',
        //             attributes: ['id', 'first_name', 'last_name', 'image']
        //         }
        //     ],
        //     where: {
        //         '$order_products.seller_id$': u_id
        //     }
        // })

        return {
            data: response,
            status: true,
            message: 'Seller sale History'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteUserAccount = async (req) => {
    try {
        const id = await getUserIdFromToken(req)
        const { reason, password } = req.body

        let checkUser = await db.User.findOne({
            where: {
                id: id
            }
        })
        // let checkPassword = await comparePassword(password, checkUser.password)
        // if (!checkPassword) {
        //     return {
        //         status: false,
        //         message: 'Your password not matched'
        //     }
        // } else
        if (checkUser) {
            // u_id=1..product_id= 100..handled
            await db.reportedEvent.destroy({ where: { u_id: id } })
            await db.reportedPost.destroy({ where: { u_id: id } })
            await db.reportedProduct.destroy({ where: { u_id: id } })

            //u_id=2, product_id=100..not handled

            //delete all the record from reported product that have product of deleted user
            let products = await db.UserProducts.findAll({ where: { u_id: id } })
            const productIds = products.map((product) => product.id)
            await db.reportedProduct.destroy({ where: { product_id: productIds } })
            //same for event of that user

            let events = await db.Events.findAll({ where: { u_id: id } })
            const eventsId = events.map((event) => event.id)
            await db.reportedEvent.destroy({ where: { event_id: eventsId } })

            //same for reported post

            let post = await db.Posts.findAll({ where: { u_id: id } })
            const postId = post.map((post) => post.id)
            await db.reportedPost.destroy({ where: { post_id: postId } })

            //remove data from notification
            await db.joinEvent.destroy({
                where: {
                    u_id: id
                }
            })
            //remove user data from notification table
            await db.notification.destroy({
                where: {
                    u_id: id
                }
            })
            await db.Events.destroy({ where: { u_id: id } })
            await db.Posts.destroy({ where: { u_id: id } })
            await db.UserProducts.destroy({ where: { u_id: id } })

            await db.PostComments.destroy({ where: { u_id: id } })
            await db.PostLikes.destroy({ where: { u_id: id } })

            if (checkUser?.image) {
                await deleteImage(checkUser?.image)
            }

            await db.User.update({ is_deleted: true, delete_reason: reason }, {
                where: {
                    id: id
                }
            })

            return {
                status: true,
                message: 'User is deleted'
            }
        } else {
            return {
                status: false,
                message: 'User  is not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const notificationSetting = async (req) => {
    try {
        const id = await getUserIdFromToken(req)
        const { email_notification, sms_notification, recieve_msg, promotional_offers, two_fector_auth } = req.body
        let check_data_available = await db.notificationSetting.findOne({
            where: {
                u_id: id
            }
        })
        if (check_data_available) {
            let response = await db.notificationSetting.update(
                {
                    email_notification,
                    sms_notification,
                    recieve_msg,
                    promotional_offers,
                    two_fector_auth,
                    u_id: id
                },
                {
                    where: {
                        u_id: id
                    }
                }
            )
            await db.User.update(
                {
                    two_fector_auth_check_detail: two_fector_auth
                },
                {
                    where: {
                        id: id
                    }
                }
            )
            return {
                data: response,
                status: true,
                message: 'data is Update'
            }
        } else {
            let response = await db.notificationSetting.create({
                email_notification,
                sms_notification,
                recieve_msg,
                promotional_offers,
                two_fector_auth,
                u_id: id
            })
            await db.User.update(
                {
                    two_fector_auth_check_detail: two_fector_auth
                },
                {
                    where: {
                        id: id
                    }
                }
            )

            return {
                data: response,
                status: true,
                message: 'record is created'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}
const getNotificationSetting = async (req) => {
    try {
        const id = await getUserIdFromToken(req)
        let notification_setting_data = await db.notificationSetting.findOne({
            where: {
                u_id: id
            }
        })
        return {
            data: notification_setting_data,
            status: true,
            message: 'Seller sale History'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const addSellerToFevrate = async (req) => {
    try {
        const id = await getUserIdFromToken(req)
        const { seller_id } = req.body

        if (seller_id == id) {
            return {
                status: false,
                message: `You can't add yourself into your network`
            }
        }

        let all_ready_fev = await db.favoriteSeller.findOne({
            where: {
                u_id: id,
                seller_id: seller_id
            }
        })
        if (all_ready_fev) {
            await db.favoriteSeller.destroy({
                where: {
                    u_id: id,
                    seller_id: seller_id
                }
            })
            return {
                status: true,
                message: 'Seller Is Remove from Fevrate'
            }
        } else {
            await db.favoriteSeller.create({
                u_id: id,
                seller_id: seller_id
            })
            return {
                status: true,
                message: 'Seller Is Added To fevrate'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getAllFevrateSeller = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { limit, offset } = await facetStage(req.query.page)
    const is_organic = req.query.is_organic
    //all fev seller
    let sellerIds = await db.favoriteSeller.findAll({
        attributes: ['seller_id', 'u_id'],
        where: {
            u_id: u_id
        },
        raw: true
    })

    sellerIds = sellerIds?.length ? sellerIds.map((e) => e.seller_id) : []

    //hide seller array data
    let seller_data = await db.hideSeller.findAll({
        where: {
            u_id: u_id
        }
    })
    let seller_id_data = []
    seller_id_data = seller_data?.length ? seller_data.map((d) => d.seller_id) : []

    //organic seller id
    let seller_data_with_organic_product = await db.UserProducts.findAll({
        where: {
            is_organic: true
        }
    })
    let seller_id_data_organic = []
    seller_id_data_organic = seller_data_with_organic_product?.length ? seller_data_with_organic_product.map((d) => d.u_id) : []
    const uniqueArray = [...new Set(seller_id_data_organic)]

    let allSellers
    //let where = is_organic == 'false' ? {[db.Op.and]: [{id: {[db.Op.in]: sellerIds}}, {id: {[db.Op.notIn]: seller_id_data}}]}
    //console.log('where', where, is_organic)
    allSellers = await db.User.findAll({
        where: {
            [db.Op.and]: [{ id: { [db.Op.in]: sellerIds } }, { id: { [db.Op.notIn]: seller_id_data } }],
            is_block: false,
            disable: false
        },
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM ratings WHERE seller = user.id)`), 'count'],
                [db.sequelize.literal(`(SELECT AVG(rating) FROM ratings WHERE seller = user.id)`), 'avg'],
                [db.sequelize.col('address'), 'location'],
                [db.sequelize.literal(`CASE WHEN EXISTS(SELECT 1 FROM favoriteSellers WHERE favoriteSellers.seller_id = user.id AND favoriteSellers.u_id = ${u_id}) THEN TRUE ELSE FALSE END`), 'isFev']
            ],
            exclude: ['password', 'auth_token', 'login_token', 'social_id', 'createdAt', 'updatedAt', 'fcm_token', 'verification_code']
        },
        include: [
            {
                association: 'userProducts',
                attributes: { include: [[db.sequelize.literal(`EXISTS(SELECT * FROM favorites WHERE product_id = userProducts.id AND u_id = ${u_id})`), 'isFev']] },
                include: [
                    {
                        association: 'trade'
                    },
                    {
                        association: 'category'
                    },
                    {
                        association: 'chemicall'
                    },
                    {
                        association: 'fev-product'
                    },
                    {
                        association: 'chemical_data',

                        include: [
                            {
                                association: 'chemical_data_detail'
                            }
                        ]
                    }
                ]
                //attributes: ['id', [db.sequelize.literal(`EXISTS(SELECT * FROM favorites WHERE product_id = userProducts.id AND u_id = ${u_id})`), 'isFev']]
            }
        ],

        offset: offset,
        limit: limit
    })

    // let ratingCount = await db.rating.count({where: {seller: u_id}})
    // let sum = await db.rating.sum('rating', {where: {seller: u_id}})
    // let avg = sum / ratingCount
    // let average = avg.toFixed(1)

    return {
        data: { allSellers },
        status: true,
        message: `View all sellers`
    }
}

const disableAccount = async (req) => {
    try {
        const { u_id, enable } = req.body
        await db.User.update(
            {
                disable: enable ? false : true
            },
            {
                where: {
                    id: u_id
                }
            }
        )

        return {
            status: true,
            message: enable ? 'User Account is Enabled' : 'User Account is disable'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getAllDisableAccount = async (req) => {
    try {
        //const id = await getUserIdFromToken(req)
        const { limit, offset } = await facetStage(req.query.page)
        const { u_id } = req.body

        let disable_user = await db.User.findAndCountAll({
            where: {
                disable: true
            },
            attributes: { exclude: ['password', 'login_token', 'auth_token', 'verification_code'] },
            limit: limit,
            offset: offset
        })
        const remainingCount = disable_user?.count - (offset + disable_user?.rows.length)
        return {
            data: { disable_user: disable_user.rows, count: disable_user.count, remaining: remainingCount, page: req.query.page },
            status: true,
            message: 'All Disable Account'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}
const enableAccount = async (req) => {
    try {
        const { u_id } = req.body
        await db.User.update(
            {
                disable: false
            },
            {
                where: {
                    id: u_id
                }
            }
        )

        return {
            status: true,
            message: 'User Account is Enable'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const verfyTwoFectorCode = async (req) => {
    try {
        const { email, verification_code } = req.body

        let popup = []
        const user = await db.User.findOne({ where: { email: email } })
        if (user) {
            const verifyCode = await db.User.findOne({ where: { email: email, verification_code: verification_code } })
            const alreadyVerified = await db.User.findOne({ where: { email: email, two_fector_auth: true } })
            if (alreadyVerified) {
                return {
                    status: false,
                    message: 'User already verified, Please login'
                }
            }

            if (verifyCode) {
                const update_user = await db.User.update({ two_fector_auth: true }, { where: { id: user.id } })
                if (update_user) {
                    return {
                        status: true,
                        message: `Two Factor-Auth verified successfully`,
                        data: { popUp: popup }
                    }
                }
            }
            return {
                status: false,
                message: 'Wrong verification code'
            }
        }
        return {
            status: false,
            message: 'User with this email not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const userPrivacySetting = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { display_phone, display_email, display_dob, display_location, display_profile, display_dob_full_format } = req.body
        await db.User.update(
            {
                display_phone,
                display_email,
                display_dob,
                display_location,
                display_profile,
                display_dob_full_format
            },
            {
                where: {
                    id: u_id
                }
            }
        )

        return {
            status: true,
            message: 'User Privacy Setting Save'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}
const getuserPrivacySetting = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)

        let response = await db.User.findOne({
            attributes: ['display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified'],
            where: {
                id: u_id
            }
        })

        return {
            data: response,
            status: true,
            message: 'User Privacy Setting'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const connectTradeProduct = async (req) => {
    try {
        const { full_name, email, phone_number, interested_in, more_info, user_email } = req.body
        const user = { full_name, email, phone: phone_number, interested: interested_in, info: more_info }
        let res = await connectTradeProductEmail(user_email, user)
        // const { full_name, email, phone_number, interested_in, more_info, user_email, title, seller_name } = req.body
        // const user = { full_name, email, phone: phone_number, interested: interested_in, info: more_info }
        // let res = await connectGiveAwayProductSellerEmail(user_email, seller_name, title, full_name)
        // let res2 = await connectGiveAwayProductBuyerEmail(email, full_name, title)

        if (res) {
            return {
                data: true,
                status: true,
                message: 'Email sent successfully'
            }
        } else {
            return {
                data: true,
                status: false,
                message: 'Failed to sent email'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const contactWithUs = async (req) => {
    try {
        const { full_name, email, phone_number, topic, message } = req.body
        const user = { full_name, email, phone: phone_number, topic, message }
        let res = await contactUsEmail(user)

        if (res) {
            return {
                data: true,
                status: true,
                message: 'Email sent successfully'
            }
        } else {
            return {
                data: true,
                status: false,
                message: 'Failed to sent email '
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getAllBlockUsers = async () => {
    try {
        let users = await db.User.findAll({ where: { [db.Op.or]: [{ is_block: true }, { disable: true }] }, attributes: ['id'], raw: true })
        users = users.map(re => re.id)
        return {
            status: true,
            data: users,
            message: 'All block or diable users'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

export { getAllBlockUsers, connectTradeProduct, contactWithUs, userProfile, autoCreate, facetStage, deleteUserAllData, getUserNotificationsArray, getNewNotificatins, sendChatFcm, getAllNotification, registerUser, updateUser, autoLogin, loginUser, socialLogin, deleteUser, viewAllUser, sendRegisterCode, sendVerificationCode, verfyRegisterCode, resetPassword, updatePassword, searchByName, updateSocialUser, blockedUser, getUserById, getAllSellers, searchSellers, getUserWMaxPosts, topSeller, updateUserPassword, getSellerById, contectUs, getContectUs, notification, hideSellerProfile, SellerOrderData, deleteUserAccount, notificationSetting, getNotificationSetting, addSellerToFevrate, getAllFevrateSeller, disableAccount, getAllDisableAccount, enableAccount, verfyTwoFectorCode, userPrivacySetting, getuserPrivacySetting, markAllReadnotification, readNotification }
