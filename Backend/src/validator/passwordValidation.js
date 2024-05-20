import {check, validationResult} from 'express-validator'

const isPasswordValidate = [check('password').isLength({min: 8}).withMessage('Password must contains 8 letters or more')]
const passwordrequestValidated = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(200).json({status: false, message: errors.array()[0].msg})
    }
    next()
}
export {isPasswordValidate, passwordrequestValidated}
