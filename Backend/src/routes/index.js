import express from 'express'
import * as userRoutes from '../routes/userRoute.js'
import * as adminRoute from '../routes/adminRoute.js'
import * as eventRoutes from '../routes/eventRoute.js'
import * as postRoutes from '../routes/postRoute.js'
import * as productRoutes from '../routes/productRoute.js'
import * as checkoutRoutes from '../routes/checkoutRoute.js'
import * as addToCartRoute from '../routes/addToCartRoute.js'

const router = express.Router()

router.use('/admin', adminRoute.router)

router.use('/user', userRoutes.router)
router.use('/user/event', eventRoutes.router)
router.use('/user/posts', postRoutes.router)
router.use('/user/product', productRoutes.router)
router.use('/user/checkout', checkoutRoutes.router)
router.use('/user/addto', addToCartRoute.router)

export {router}
