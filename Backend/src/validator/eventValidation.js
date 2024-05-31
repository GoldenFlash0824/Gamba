import {check, validationResult} from 'express-validator'
const price = [check('price').notEmpty().withMessage('price is required')]
const location = [check('location').notEmpty().withMessage('location is required')]
const title = [check('title').notEmpty().withMessage('title is required')]
const end_date = [check('end_date').notEmpty().withMessage('end_date is required')]
const start_date = [check('start_date').notEmpty().withMessage('start_date is required')]

const isRequestValid = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(200).json({status: false, message: errors.array()[0].msg})
    }
    next()
}
export {price, location, title, end_date, start_date, isRequestValid}
