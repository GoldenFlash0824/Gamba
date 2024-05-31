import dotenv from 'dotenv'
import twilio from 'twilio'
dotenv.config()

const sendSms = async (phone, code) => {
    try {
        if (phone && code) {
            let phoneNumber = phone.replace(/[- )+(]/g, '')
            phoneNumber = phoneNumber.replace(/^0/, '')
            phoneNumber = !phoneNumber.startsWith(1) ? '+' + phoneNumber : '+' + phoneNumber
            const msg = { body: `Hi, your Gamba account verification code is ${code}, use this code to verify your account.`, from: process.env.SENDER_PHONE, to: phoneNumber }

            const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)
            const sentMessage = await client.messages.create(msg)
            console.log('sms success', sentMessage)
            if (sentMessage) return true
        }
        return false
    } catch (error) {
        console.log('error======', error)
        return {
            status: false,
            message: error.message
        }
    }
}

const smsNotification = async (phone, userName, message) => {
    try {
        if (phone) {
            let phoneNumber = phone.replace(/[- )+(]/g, '')
            phoneNumber = phoneNumber.replace(/^0/, '')
            phoneNumber = !phoneNumber.startsWith(1) ? '+' + phoneNumber : '+' + phoneNumber
            const msg = { body: `Hi, ${userName} ${message}`, from: process.env.SENDER_PHONE, to: phoneNumber }
            const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)
            const sentMessage = await client.messages.create(msg)
            console.log('smsnotification', phone, userName, message, sentMessage)
            if (sentMessage) return true
        }
        return false
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const resetAccountPassword = async (phone, code) => {
    try {
        if (phone && code) {
            let phoneNumber = phone.replace(/[- )+(]/g, '')
            phoneNumber = phoneNumber.replace(/^0/, '')
            phoneNumber = !phoneNumber.startsWith(1) ? '+' + phoneNumber : '+' + phoneNumber
            const msg = { body: `Hi, your Gamba reset password is ${code}, use this password to login in your account.`, from: process.env.SENDER_PHONE, to: phoneNumber }
            const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)
            const sentMessage = await client.messages.create(msg)
            console.log('sms success', sentMessage)
            if (sentMessage) return true
        }
        return false
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}
export { sendSms, smsNotification, resetAccountPassword }
