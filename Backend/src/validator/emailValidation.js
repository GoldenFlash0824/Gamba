import {check, validationResult} from 'express-validator'

const isEmailValidate = [check('email').notEmpty().isEmail().withMessage('Valid email is required')]

const emailrequestValidated = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(200).json({status: false, message: errors.array()[0].msg})
    }
    next()
}
export {isEmailValidate, emailrequestValidated}
