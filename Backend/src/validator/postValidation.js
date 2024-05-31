import {check, validationResult} from 'express-validator'
const description = [check('description').notEmpty().withMessage('description is required')]
const isPostIdValid = [check('p_id').notEmpty().withMessage('Post Id is required')]
const isCommentIdValid = [check('c_id').notEmpty().withMessage('Comment Id is required')]
const isReplyIdValid = [check('r_id').notEmpty().withMessage('Reply Id is required')]

const isRequestValid = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(200).json({status: false, message: errors.array()[0].msg})
    }
    next()
}
export {description, isRequestValid, isPostIdValid, isCommentIdValid, isReplyIdValid}
