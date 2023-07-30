import express from 'express'
import { login, logout, refresh } from '../controllers/authController.js'
const router = express.Router()


router.route('/login')
    .post(login)

router.route('/logout')
    .post(logout)

router.route('/refresh')
    .get(refresh)

export default router