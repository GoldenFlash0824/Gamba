import express from 'express'
import * as productController from '../controllers/productController.js'
import {verifyAuthToken} from '../utilities/authentication.js'
import {name, quantity, category, isRequestValid} from '../validator/productValidation.js'

const router = express.Router()

router.post('/add_new_product', verifyAuthToken(), name, quantity, category, isRequestValid, productController.createProductGood)
router.post('/update_product/:product_good_id', verifyAuthToken(), name, quantity, category, productController.updateProductGood)
router.delete('/delete_product_good/:product_good_id', verifyAuthToken(), productController.deleteProductGood)
router.get('/get_all_products', productController.getAllProductGood)
router.post('/product_orders', productController.soldProductGood)
router.post('/verify_card', verifyAuthToken(), productController.verifyCard)
router.post('/mark_favorite', verifyAuthToken(), productController.markfev)
router.get('/get_all_category', productController.getCategory)
router.post('/search', productController.search)
router.get('/get_all_chemical', verifyAuthToken(), productController.getChemical)
router.get('/search_products', productController.searchProductGood)
router.get('/get_user_products', productController.getUserProductGood)
router.get('/side_bar_count_product', productController.sideBarCountProduct)

router.post('/add_rating', verifyAuthToken(), productController.addRating)
router.get('/get_product_rating/:id', verifyAuthToken(), productController.getProductRating)
router.post('/update_product_rating', verifyAuthToken(), productController.updateProductRating)
router.post('/get_product_by_id', productController.getProductById)
router.get('/get_fev_product', verifyAuthToken(), productController.getFevProduct)
export {router}
