import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import morgan from 'morgan'
import cors from'cors'
import chatRouter from './routes/chat.route.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
    methods:['GET','POST','PUT','DELETE']
}))
app.use('/api/auth',authRouter)
app.use('/api/chat',chatRouter)

export default app 