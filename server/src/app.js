import 'dotenv/config'
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { upload } from './service/multer.service.js'
import { uploadToImageKit } from './service/imagekit.service.js'
import { register, login, logout } from './controller/auth.controller.js'
import authRouter from './routes/auth.routes.js'

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true}))

app.get('/',  (req, res)=>{
    res.send("api is working")
})

app.use('/api/auth', authRouter)
export default app

