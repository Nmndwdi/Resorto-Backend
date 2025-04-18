import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin: 'https://resorto.vercel.app/',
    // origin: 'http://localhost:5173',
    // origin: 'http://192.168.1.159:5173',
    // origin: 'http://192.168.43.147:5173',
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"
}))
app.use(cookieParser())
// app.use(express.static("public"))

import userRouter from './routes/user.routes.js'
import infoRouter from './routes/info.routes.js'
import infoRetrieverRouter from './routes/infoRetrieving.routes.js'
import reviewRouter from './routes/review.routes.js'
import reviewAdminRouter from './routes/review.admin.routes.js'

app.use("/api/v1/admin", userRouter)
app.use("/api/v1/admin", infoRouter)
app.use("/",infoRetrieverRouter)
app.use("/api/v1/admin", reviewAdminRouter)
app.use("/", reviewRouter)

import errorHandler from "./middlewares/errorHandler.middleware.js"

app.use(errorHandler)

export {app}