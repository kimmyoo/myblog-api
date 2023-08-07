import express from 'express'
import { login, logout, refresh } from '../controllers/authController.js'
import loginLimiter from '../middleware/loginLimiter.js'
const router = express.Router()


router.route('/login')
    .post(loginLimiter, login)

router.route('/logout')
    .post(logout)

router.route('/refresh')
    .get(refresh)

export default router