import express from 'express'
import * as postController from "../controllers/postController.js"
import verifyJWT from '../middleware/verifyJWT.js'
const router = express.Router()

// ensure request to this route '/posts/....' all 
// have valid token also grabbed the user info
router.use(verifyJWT)


router.route('/')
    .get(postController.getAllPosts)
    .post(postController.createPost)
    .delete(postController.deletePost)
    .patch(postController.editPost)

router.route('/search')
    .get(postController.searchPost)

router.route('/post/:postId')
    .get(postController.getSinglePost)


export default router