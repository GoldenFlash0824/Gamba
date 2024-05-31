import {check, validationResult} from 'express-validator'
const name = [check('name').notEmpty().withMessage('name is required')]
const quantity = [check('quantity').notEmpty().withMessage('quantity  is required')]
const category = [check('category_id').notEmpty().withMessage('category  is required')]

const isRequestValid = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(200).json({status: false, message: errors.array()[0].msg})
    }
    next()
}
export {name, quantity, category, isRequestValid}
