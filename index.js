/* imports */
// 3rd party packages
import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer";
import helmet from "helmet"
import morgan from "morgan";
import corsOptions from "./config/corsOptions.js";
// built-in packages
import path from "path"
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";


// middleware
import verifyJWT from "./middleware/verifyJWT.js";
import { logger } from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

// routes import
import rootRoutes from "./routes/rootRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js"
import authRoutes from "./routes/authRoutes.js"

// controller import
import { register } from "./controllers/authController.js";


/* middleware for configurations  */
// if you want to use dir name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// for using .env files 
dotenv.config()

// instantiate express app
const app = express()
app.use(logger)
// allows cross origin requests
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
// for logging http requests 
app.use(cors(corsOptions))
// for parsing json()
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(morgan("common"))

/* Parse incoming request bodies in a 
middleware before your handlers, 
available under the req.body property. */
/* param: extended
The extended option allows to choose 
between parsing the URL - encoded data 
with the querystring library(when false) or 
the qs library(when true). */
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets/images")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png" && ext !== ".mp4") {
            return cb(res.status(400).json({ message: "only jpg, jpeg, png or mp4 file allowed" }), false)
        }
        cb(null, true)
    }
})

const upload = multer({ storage: storage })


// store locally but for deployment, change this to s3 bucket or other cloud storage platform.
app.use("/assets", express.static(path.join(__dirname, "public/assets")))

// routes
// regsiter route and controller stay here because
// they need to use upload directly from app
app.use("/", rootRoutes)
app.post("/auth/register", upload.single("picture"), register)

// enable verifyJWT later
// app.post("/auth/register", upload.single("picture"), verifyJWT, register)
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

/* database */
// mongoose setup   
// if env.PORT doesn"t work use 6001
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.use(errorHandler)
    app.listen(PORT, () => {
        console.log(`db connected, server running on port: ${PORT}`)
    })
}).catch((err) => {
    console.log(`${err} did not connect.`)
})
