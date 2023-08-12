import allowedOrigins from "./allowedOrigins.js"

const corsOptions = {
    origin: (origin, callback) => {

        // this is for development using postman, postman has no origin
        // if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        if (allowedOrigins.indexOf(origin) !== -1) {
            // allow
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },

    credentials: true,
    optionsSuccessStatus: 200
}

export default corsOptions