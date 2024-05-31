import * as postController from '../controllers/userPostController.js'
import express from 'express'
import {verifyAuthToken} from '../utilities/authentication.js'
import {description, isRequestValid} from '../validator/postValidation.js'

const router = express.Router()

router.post('/create_post', verifyAuthToken(), description, isRequestValid, postController.createPost)
router.post('/update_post/:posteId', verifyAuthToken(), postController.updatePost)
router.delete('/delete_post/:post_id', verifyAuthToken(), postController.deletePost)
router.get('/get_user_all_posts', verifyAuthToken(), postController.viewAllUserPosts)
router.post('/add_like', verifyAuthToken(), postController.addPostLike)
router.post('/un_like', verifyAuthToken(), postController.unLikePost)
router.post('/add_comment', verifyAuthToken(), postController.addPostComment)
router.get('/get_all_posts', postController.viewAllPosts)
router.get('/view_single_user', verifyAuthToken(), postController.viewSingleUserPosts)
router.get('/search_posts', postController.searchPosts)
router.get('/get_popular_post', postController.popularPost)
router.post('/get_post_by_id', postController.viewPostById)
router.post('/hide_post', verifyAuthToken(), postController.hidePost)

router.post('/all_likes', postController.getAllPostLikes)
router.get('/side_bar_count', verifyAuthToken(), postController.sideBarCount)
router.post('/seller_all_post', postController.getSellerAllPost)

export {router}
