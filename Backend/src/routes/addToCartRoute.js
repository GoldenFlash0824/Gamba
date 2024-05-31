import * as addToCartController from '../controllers/addToCartController.js'
import express from 'express'
import {verifyAuthToken} from '../utilities/authentication.js'

const router = express.Router()

router.post('/cart', verifyAuthToken(), addToCartController.createCart)
router.post('/cart/:cart_id', verifyAuthToken(), addToCartController.updateCart)
router.delete('/cart/:cart_id', verifyAuthToken(), addToCartController.deleteCart)
router.get('/cart', verifyAuthToken(), addToCartController.getAllCartProduct)

export {router}
