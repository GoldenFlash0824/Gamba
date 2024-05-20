import twilio from 'twilio'
import dotenv from 'dotenv'
dotenv.config()
const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client_phone = 18885985477
const twoFectorSms = async (phone) => {
    let code = 112255
    const client = twilio(accountSid, authToken)
    await client.messages.create({
        body: `Your two factor-Auth code is: ${code}`,
        from: client_phone,
        to: phone
    })
}

export { twoFectorSms }
