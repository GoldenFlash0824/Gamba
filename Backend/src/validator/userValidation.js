import {check, validationResult} from 'express-validator'

const isNewPasswordVlidate = [check('new_password').notEmpty().withMessage('New password is required')]

const isProviderValidate = [check('provider').notEmpty().withMessage('Provider is required')]

const isVerificationCodeValidate = [check('verification_code').notEmpty().withMessage('Verification code is required')]

const isSocialIdValidate = [check('social_id').notEmpty().withMessage('Social id is required')]

const isIdValidate = [check('u_id').notEmpty().withMessage('User id is Required')]

const isFirstNameValidate = [check('name').notEmpty().withMessage('Name is required')]

const isUserNameValidate = [check('user_name').notEmpty().withMessage('User name is required')]

const isEmailValidate = [check('email').notEmpty().withMessage('Valid email is required').isEmail().withMessage('Valid email is required')]

const isPhoneValidate = [check('phone').notEmpty().withMessage('Phone number is required').isLength({min: 1}).withMessage('Phone number is required')]

const isAgeGroupValidate = [check('age_group').notEmpty().withMessage('Age group is required')]

const isPasswordValidate = [check('password').isLength({min: 8}).withMessage('Password must contains 8 letters or more')]

const isFollowerIdValidate = [check('f_id').notEmpty().withMessage('Follower id is required')]

const isRequestValid = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(200).json({status: false, message: errors.array()[0].msg})
    }
    next()
}

export {isNewPasswordVlidate, isProviderValidate, isSocialIdValidate, isVerificationCodeValidate, isIdValidate, isFirstNameValidate, isUserNameValidate, isEmailValidate, isPhoneValidate, isAgeGroupValidate, isPasswordValidate, isRequestValid, isFollowerIdValidate}
