import express, { json, urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { errorHandler } from "./middlewares/errorHandler.middleware.js"

const app = express()

// express app middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(cookieParser())
app.use(urlencoded({ limit: "16kg", extended: true }))
app.use(express.json())
app.use(express.static('public'))


// import router
import userRouter from "./routes/user.routes.js"


app.use('/api/v1/users', userRouter)


// error handler middleware
app.use(errorHandler)

export { app }