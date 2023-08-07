import { rateLimit } from "express-rate-limit"
import { logEvents } from "./logger.js";

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { message: 'too many login attemps from this IP, try again later' },
    handler: (req, res, next, options) => {
        logEvents(`too many requests: ${options.message.message} \t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },

    standardHeaders: true,
    legacyHeaders: false
})

// this is used in auth route 
export default loginLimiter