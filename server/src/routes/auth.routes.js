import express from "express"
import { login, register, logout } from "../controller/auth.controller.js"
import { upload } from "../service/multer.service.js"

const authRouter = express.Router()

authRouter.post('/register',upload.single('profileImage') , register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)

export default authRouter
