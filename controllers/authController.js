import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import asyncHandler from 'express-async-handler'


const register = asyncHandler(
    async (req, res) => {
        const {
            username,
            email,
            password,
            profilePath
        } = req.body
        // console.log(req.body)
        // generate salt, genSalt() is async. 
        const salt = await bcrypt.genSalt()
        // hash the password, hash() is async
        const hashedPassword = await bcrypt.hash(password, salt)
        // newUser object
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePath
        })
        // save the user save() is async makesure to use await
        const savedUser = await newUser.save()
        if (savedUser) {
            res.status(201).json(savedUser)
        } else {
            console.log(err)
            res.status(500).json({ error: err.message })
        }
    }
)

const login = asyncHandler(
    async (req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "all fields needed." })
        }
        const user = await User.findOne({ email: email }).exec()
        // the exact reason is user doesn't exist but
        // for safety just return a response and let user know 
        // invalid credentials
        if (!user) return res.status(401).json({ message: "Unauthorized: invalid email or password" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Unauthorized: invalid email or password" })
        }

        delete user.password

        // access token
        const accessToken = jwt.sign(
            {
                "userInfo": user
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        )
        // refresh token
        const refreshToken = jwt.sign(
            {
                "userInfo": {
                    "id": user._id,
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )
        //put refresh token in cookie send it as http only cookie.
        res.cookie('jwt', refreshToken, {
            httpOnly: true, // only accessible to web server
            secure: true,  //https
            sameSite: 'None',  //cross site cookie allows different servers for hosting
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
        })
        // grant access token, protected api routes requires access token
        res.status(200).json({ accessToken: accessToken })
    }
)


const refresh = (req, res) => {
    const cookies = req.cookies
    // console.log(cookies)
    if (!cookies?.jwt) return res.status(401).json({ message: "unauthorized" })
    // we do received the cookies 
    const refreshToken = cookies.jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        // async function to catch any errors during verification of token
        // decoded: has the information of decoded userInfo
        asyncHandler(
            async (err, decoded) => {
                // console.log(decoded)
                if (err) return res.status(403).json({ message: 'forbidden' })
                const user = await User.findOne({ _id: decoded.userInfo.id }).lean()

                delete user.password
                // found the user and grant another access token
                const accessToken = jwt.sign(
                    {
                        "userInfo": user
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30m' }
                )

                res.json({ accessToken: accessToken })
            }
        )
    )
}


const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) // no content

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    })
    res.json({ message: 'cookies cleared' })
}

export { register, login, logout, refresh }