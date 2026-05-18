import 'dotenv/config'
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { upload } from './service/multer.service.js'
import { uploadToImageKit } from './service/imagekit.service.js'
import { register, login } from './controller/auth.controller.js'

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true}))

app.post('/', upload.single('profileImage'), register)
app.post('/login', login)
export default app

