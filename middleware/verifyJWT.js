import jwt from 'jsonwebtoken'

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'unauthorized, request has not authorization header' })
    }
    // looks like this, "Bearer token_string!#!$^%"
    const token = authHeader.split(' ')[1]
    // make sure the token is actually valid
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: "request was failed due to token verification failure" })
            // req.user 在这里设置的~
            // console.log(decoded)
            // req.user is the user._id
            req.user = decoded.userInfo._id
            next() // move to next step which is the controller
        }
    )
}

// applied this middleware before each route that needs protection
export default verifyJWT