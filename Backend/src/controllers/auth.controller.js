import userModel from "../models/user.model.js"
import { sendEmail } from "../services/mail.service.js"
import jwt from "jsonwebtoken";

export const registerController = async(req,res)=>{
    const{email,password,username} = req.body
    const isUserPresent =await userModel.findOne({
        $or:[
            {email},
            {username}

        ]
    })
    if(isUserPresent){
        return res.status(400).json({
            message:"user already prenset with this username or email ",
            success:false,
            err:"user already exist"


          })
    }
    const user = await userModel.create({
        username,email,password
    })

    const jwtverifytoken = jwt.sign({
        email:user.email
    },process.env.JWT_SECRET)

     
    await sendEmail({
        to:email,
        subject:'Welcome to perplexity!',
         html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${jwtverifytoken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
    })
     res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

export async function loginHandler(req,res){
    const{email,password} = req.body
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"user not present with this email id ",
            success:false,
            err:"user not found"
        })
    }
    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        return res.status(400).json({
            message:"Invalid password",
            success:false,
            err:"wrong password"
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message:"please verify your email before logging in",
            success:false,
            err:"email not verified"
        })
    }

    const token = jwt.sign({
        id:user._id,
        username:user.username
    }, process.env.JWT_SECRET,{expiresIn:'7d'})

    res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
})

    res.status(200).json({
        message:"user logged in successfully",
        success:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}


export async function getme(req,res){
    const userId = req.user.id
    const user = await userModel.findById(userId).select("-password")

     if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}


export async function verifyEmail(req,res){
    const {token}= req.query;

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const user = await userModel.findOne({email:decoded.email})

    if(!user){
        return res.status(400).json({
            message:"Invalid token",
            success:false,
            err:"user not found"
        })
    }
    user.verified = true

    await user.save()
    const html =
            `
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="http://localhost:3000/login">Go to Login</a>
    `
    return res.send(html);
}
