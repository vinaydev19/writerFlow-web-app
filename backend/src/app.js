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

// error handler middleware
app.use(errorHandler)



// import router

// user router




export { app }