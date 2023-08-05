import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Post from '../models/Post.js'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'


const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'user id is needed' })
    // using lean() in mongoose returns a regular javascript object
    // in this case I want to delete password property
    // not using lean() will cause the property being unable to be deleted.
    const user = await User.findById(id).lean()
    // need to add await to get the number
    // countDocuments() is async 
    const numOfposts = await Post.countDocuments({ author: id })


    // need to convert string id to ObjectId
    // Class constructor ObjectId cannot be invoked without 'new'
    const userObjectId = new mongoose.Types.ObjectId(id)
    // select count group by ***
    const categories = await Post.aggregate([
        { $match: { "author": userObjectId } },
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 }
            }
        }
    ])

    delete user.password
    user['numOfposts'] = numOfposts
    user['categories'] = categories
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