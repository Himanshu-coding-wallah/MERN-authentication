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

        return res.status(201).json({
            message: "user registered successfully",
        })

    } catch (error) {
        console.log(error)
    }

}

export const login = async (req, res)=>{
    const {email, password} = req.body

    if(!email || !password){
        return res.json({
            message: "please fill the details"
        })
    }

    try {
        const user = await UserModel.findOne({email})
    
        if(!user){
            return res.json({
                message: "user do not exist"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({
                message: "wrong password"
            })
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn: 7*24*60*60*1000}
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === ' production ',
            sameSite: process.env.NODE_ENV === 'production'? 'none': 'strict'
        })

        return res.json({
            message: "user is loggedin successfully"
        })

    } catch (error) {
        console.log(error)
    }

}

export const logout = async (req, res)=>{
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === ' production ',
            sameSite: process.env.NODE_ENV === 'production'? 'none': 'strict' 
        })

        return res.json({
            message: "successfully logged out"
        })
    } catch (error) {
        console.log(error)
    }

}