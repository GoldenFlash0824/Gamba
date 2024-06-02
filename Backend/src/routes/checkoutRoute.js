import * as checkoutController from '../controllers/checkoutController.js'
import express from 'express'
import { verifyAuthToken } from '../utilities/authentication.js'

const router = express.Router()

router.post('/payment', verifyAuthToken(), checkoutController.processCashOnDelivery)
router.post('/payment/:checkout_id', verifyAuthToken(), checkoutController.updateCheckout)
router.get('/orders', verifyAuthToken(), checkoutController.getOrders)
router.post('/payment_stripe', verifyAuthToken(), checkoutController.makePayment)
router.post('/process_payment', verifyAuthToken(), checkoutController.processPayment)       //Added by Fayiz | I haven't modified the existing one (/payment_stripe) because I'm not sure where it's being used and how it might affect existing logic. Instead, I've added a new endpoint and made the necessary modifications.

router.get('/connect_to_stripe', verifyAuthToken(), checkoutController.connectStripe)
router.get('/is_merchant_connected', verifyAuthToken(), checkoutController.isMerchantConnected)

router.post('/user_account', verifyAuthToken(), checkoutController.retriveAccount)

router.get('/remove_connected_account', verifyAuthToken(), checkoutController.removeAccount)

router.post('/add_card', verifyAuthToken(), checkoutController.addCard)
router.get('/my_cards', verifyAuthToken(), checkoutController.myCards)
router.put('/change_default_payment', verifyAuthToken(), checkoutController.changDefaultPayment)
router.delete('/remove_card/:paymentMethodId', verifyAuthToken(), checkoutController.deleteCard)

router.post('/complete_payment/pay', verifyAuthToken(), checkoutController.initializToPayment)
export { router }
