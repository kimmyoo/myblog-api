import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import asyncHandler from 'express-async-handler'


const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'user id is needed' })
    const user = await User.findById(id)
    delete user.password
    res.status(200).json(user)
})


const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'user id is needed' })
    const {
        username,
        password,
        profilePath
    } = req.body

    const user = await User.findById(id).exec()

    if (username && username !== user.username) {
        user.username = username
    }
    if (profilePath && profilePath !== user.profilePath) {
        user.profilePath = profilePath
    }
    if (password) {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        user.password = hashedPassword
    }
    const updatedUser = await user.save()
    if (!updatedUser) {
        res.status(400).json({ message: "updating user failed" })
    }
    return res.status(200).json(updatedUser)
})

export { getUser, updateUser }