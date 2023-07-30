import express from 'express'
import * as userController from '../controllers/userController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

// disable this first, because of postman testing
// router.use(verifyJWT)

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)

export default router