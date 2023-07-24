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

// built-in packages
import path from "path"
import { fileURLToPath } from "url";

/* middleware for configurations  */
// if you want to use dir name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// for using .env files 
dotenv.config()

// instantiate express app
const app = express()

// for parsing json()
app.use(express.json())
app.use(helmet())
// allows cross origin requests 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
// for logging http requests 
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

app.use(cors())
// store locally but for deployment, change this to s3 bucket or other cloud storage platform.
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))


/* file storage */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

/* database */
// mongoose setup   
// if env.PORT doesn't work use 6001
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {
        console.log(`server port: ${PORT}`)
    })
}).catch((err) => {
    console.log(`${err} did not connect.`)
})
