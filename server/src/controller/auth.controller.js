import { UserModel } from "../models/user.model.js"
import { uploadToImageKit } from "../service/imagekit.service.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

export const register = async (req, res)=>{
    const {name, username, email, password} = req.body
    const imageBuffer = req.file.buffer

    if(!email || !name || !username || !password){
        return res.json({
            message: "please fill all details"
        })
    }

    try {
        const isAlreadyExist = await UserModel.findOne({email})
        if(isAlreadyExist){
            return res.json({
                message: "email already exists"
            })
        }
    
        const imageURL = await uploadToImageKit(imageBuffer)
    
        const hashPassword = await bcrypt.hash(password, 10)
    
        const user = new UserModel({
            name,
            username,
            email,
            profileImage: imageURL?.url,
            password: hashPassword
        })
        await user.save()

        const token = jwt.sign(
            {id: user._id}, 
            process.env.JWT_SECRET_KEY,
            {expiresIn: "7d"}
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none': 'strict',
            maxAge: 7*24*60*60*1000
        })

        res.status(201).json({
            message: "user is created",
            user: user
        })

    } catch (error) {
        console.log(error)
    }

}