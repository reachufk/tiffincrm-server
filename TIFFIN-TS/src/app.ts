import express, {Request, Response, NextFunction, Application,
ErrorRequestHandler, json} from 'express'
import mongoose  from "mongoose"
import cors from "cors"
import compression from "compression"
import dotenv from 'dotenv'
import connectDb from './application/config/connectDB'
import { router } from './application/routes-domain/domain-routes'


const app:Application = express()
connectDb()
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(json());
app.use(compression())
app.use(router)


const port = process.env.PORT || 4000
app.listen(port, ()=>{
    console.log(` app is running on port ${port}`)
})
