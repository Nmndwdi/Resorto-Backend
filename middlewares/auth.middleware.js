import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try {
        const token = req.cookies?.accessToken

        if(!token){
            throw new ApiError(401, "Unautphorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if(!user) {
            throw new ApiError(401," Invalid Access Token")
        }
        req._id=user._id;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})