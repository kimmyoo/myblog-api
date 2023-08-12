import allowedOrigins from "./allowedOrigins.js"

const corsOptions = {
    origin: (origin, callback) => {
        // for production
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // throw error
            callback(new Error('Not allowed by CORS'))
        }
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        // this is for development using postman
        // if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        //     // allow
        //     callback(null, true)
        // } else {
        //     callback(new Error('Not allowed by CORS'))
        // }
    },

    credentials: true,
    optionsSuccessStatus: 200
}

export default corsOptions