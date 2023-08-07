import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import * as fs from 'fs'
import * as fsPromises from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${nanoid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

const logger = (req, res, next) => {
    // only record login requests 
    if (req.method === "POST" && req.url === "/auth/login") {
        logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    }
    // console.log(`${req.method} ${req.path}`)
    next()
}

export { logEvents, logger }