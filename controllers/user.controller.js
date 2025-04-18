import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from '../utils/ApiError.js'
import { sendOtpEmail } from "../utils/email.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(user) => {
    try {
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
}

const register = asyncHandler(async(req,res) => {
    const {email,password} = req.body

    if(!email)
    {
        throw new ApiError(400, "Email is required")
    }

    const existedUser=await User.findOne({email})

    if(existedUser)
    {
        throw new ApiError(400, "User with this email already exists")
    }
        
    const user= await User.create({
        email,
        password
    })

    const createdUser = await User.findById(user._id)

    if(!createdUser)
    {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    res.status(201).json(new ApiResponse(200,{},'User created Successfully'))
})

const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    if(!email)
    {
        throw new ApiError(400, "Email is required")
    }
    const user=await User.findOne({email})
    
    if(!user) {
        throw new ApiError(404, "User does not exists")
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid) {
        throw new ApiError(401,"Incorrect Password")
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now()+5*60*1000);
    
    user.otp=otp;
    user.otpExpires=otpExpires
    await user.save()
        
    await sendOtpEmail(email, otp)
    
    res.status(200).json(new ApiResponse(200,{},"OTP sent successfully"))
})

const loginPart2 = asyncHandler(async(req,res)=>{
    const {email, otp} = req.body

    const user=await User.findOne({email})
    
    if(!user || user.otp!==otp || new Date()>user.otpExpires){
        throw new ApiError(400, "Invalid or Expired OTP")
    }

    user.otp=null
    user.otpExpires=null;
    await user.save();

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user)

    user.refreshToken=refreshToken

    await user.save({validateBeforeSave: false})

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24 * 10
    }

    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{},"User logged in successfully"))
})

const resetPassword = asyncHandler( async(req,res)=>{
    const {email} = req.body;
    const user=await User.findOne({email})
    if(!user)
    {
        throw new ApiError(400,"User with this email does not exists")
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now()+5*60*1000);
    
    user.otp=otp;
    user.otpExpires=otpExpires
    await user.save();
        
    await sendOtpEmail(email, otp)
        
    res.status(200).json(new ApiResponse(200,{},"OTP sent successfully"))
})

const resetPasswordPart2 = asyncHandler( async(req,res)=>{
    const {email, otp, password} = req.body

    const user = await User.findOne({email})

    if(!user || user.otp!==otp || new Date()>user.otpExpires){
        throw new ApiError(400, "Invalid or Expired OTP")
    }
    user.otp=null
    user.otpExpires=null;
    user.password=password;
    user.refreshToken=null;
    await user.save()

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24 * 10
    }
    res.clearCookie("accessToken",options)
    res.clearCookie("refreshToken",options)
    
    res.status(200).json(new ApiResponse(200,{},"password changed successfully"))
})

const refreshAccessToken = asyncHandler( async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken

    if(!incomingRefreshToken)
    {
        throw new ApiError(401,"Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

        const user= await User.findById(decodedToken?._id)
        if(!user)
        {
            throw new ApiError(401, "Invalid Refresh Token")
        }
        
        if(incomingRefreshToken !== user?.refreshToken)
        {
            throw new ApiError(401, "Refresh token is expired or used")
        }
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 1000 * 60 * 60 * 24 * 10
        }

        const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user)
        console.log(accessToken);
        
        res.status(200).cookie("accessToken",accessToken,options).json(new ApiResponse(200,{},"Access Token renewed"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }
})

const validateToken = asyncHandler( async(req,res)=>{
    const token = req.cookies?.accessToken
    if(!token){
        throw new ApiError(401, "Unauthorized request")
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)
    if(!user) {
        throw new ApiError(401," Invalid Access Token")
    }
    res.status(200).json(new ApiResponse(200,{},"Token validated successfully"))
})

const logout = asyncHandler( async(req,res)=>{
    const id=req._id
    if(!id)
    {
        throw new ApiError(400, "User not currently logged in")
    }
    const user=await User.findById(id)
    if(!user)
    {
        throw new ApiError(400, "Invalid user")
    }

    user.refreshToken=null;
    await user.save()

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24 * 10
    }
    res.clearCookie("accessToken",options)
    res.clearCookie("refreshToken",options)

    res.status(200).json(new ApiResponse(200,{},"User logged out successfully"))
})

export {register,login,loginPart2,resetPassword,resetPasswordPart2,refreshAccessToken, validateToken,logout}