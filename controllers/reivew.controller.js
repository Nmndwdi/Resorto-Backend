import { ApiError } from '../utils/ApiError.js'
import {asyncHandler} from '../utils/AsyncHandler.js'
import {Review} from "../models/review.model.js"
import { sendOtpEmail, sendReviewEmail } from '../utils/email.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const otpStore = new Map()

const reviewInitiate = asyncHandler( async(req,res)=>{
    const {name,description,stars,contact} = req.body

    if(!name || !description || !stars || !contact)
    {
        throw new ApiError(400, "Name, Description, stars and contact are the required fields")
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = 5 * 60 * 1000; // 5 minutes in milliseconds
    const otpExpires = new Date(Date.now() + ttl);

    otpStore.set(contact, {
    otp,
    expiresAt: otpExpires,
    data: {
        name,
        description,
        stars,
        contact
    }
    });

    // Automatically clear the OTP after 5 minutes
    setTimeout(() => {
    const entry = otpStore.get(contact);
    if (entry && new Date() > entry.expiresAt) {
        otpStore.delete(contact);
        console.log(`OTP for ${contact} expired and removed.`);
    }
    }, ttl);

    
    if(contact.includes('@'))
    {
        await sendOtpEmail(contact, otp)
    }
    // else
    // {
    //     // can have otp on sms functionality here
    // }

    res.status(200).json(new ApiResponse(200, {}, "OTP sent successfully"))

})

const reviewVerify = asyncHandler( async(req,res)=>{
    const {contact, otp}=req.body

    if(!contact || !otp)
    {
        throw new ApiError(400, "Contact and OTP are required")
    }

    const stored=otpStore.get(contact)
    if(!stored){
        throw new ApiError(400, "No OTP request found for this contact")
    }

    const {otp: storedOtp, expiresAt, data}=stored

    if(new Date()>expiresAt){
        otpStore.delete(contact)
        throw new ApiError(400, "OTP has expired")
    }

    if(storedOtp !== otp)
    {
        throw new ApiError(400, "Invalid OTP")
    }

    otpStore.delete(contact)
    
    if(data.stars<3)
    {
        const existingReview = await Review.findOne({contact})
        if(existingReview)
        {
            existingReview.name=data.name
            existingReview.description=data.description
            existingReview.stars=data.stars
            existingReview.approved=false
            await existingReview.save()
            
            await sendReviewEmail("naman.2024csit1064@kiet.edu", data)

            res.status(200).json(new ApiResponse(200, {}, "Review updated successfully and sent for approval"));
        }
        else
        {
            const review=await Review.create({
                ...data,
                approved:false
            })
            const createdReview = await Review.findById(review._id)
            if(!createdReview)
            {
                throw new ApiError(500, "Review can't be created")
            }

            await sendReviewEmail("naman.2024csit1064@kiet.edu", data)

            res.status(201).json(new ApiResponse(201,{},"Review created successfully and send for approval"))
        }
    }
    else
    {
        const existingReview = await Review.findOne({contact})
        if(existingReview)
        {
            existingReview.name=data.name
            existingReview.description=data.description
            existingReview.stars=data.stars
            existingReview.approved=true
            await existingReview.save()
            
            res.status(200).json(new ApiResponse(200, {}, "Review updated successfully"));
        }
        else
        {
            const review=await Review.create({
                ...data,
                approved:true
            })
            const createdReview = await Review.findById(review._id)
            if(!createdReview)
            {
                throw new ApiError(500, "Review can't be created")
            }
            res.status(201).json(new ApiResponse(201,{},"Review created successfully"))
        }

    }
})

const approvedReviews = asyncHandler( async(req,res)=>{
    const reviews= await Review.find({approved: true}).sort({stars: -1})
    // if(!reviews || reviews.length==0){
    //     throw new ApiError(400, "No approved reviews are there")
    // }
    res.status(200).json(new ApiResponse(200,reviews,"Approved reviews fetched successfully"))
})

const unapprovedReviews = asyncHandler( async(req,res)=>{
    const reviews= await Review.find({approved: false}).sort({stars: -1})
    // if(!reviews || reviews.length==0){
    //     throw new ApiError(400, "No unapproved reviews are there")
    // }
    res.status(200).json(new ApiResponse(200,reviews,"Unapproved reviews fetched successfully"))
})

const approveReview = asyncHandler( async(req,res)=>{
    const {id} = req.body
    if(!id)
    {
        throw new ApiError(400, "id of the review is required")
    }
    const review=await Review.findById(id)
    review.approved=true
    await review.save()
    res.status(200).json(new ApiResponse(200,{},"Review approved successfully"))
})

const deleteReview = asyncHandler( async(req,res)=>{
    const {id} = req.body
    
    if(!id)
    {
        throw new ApiError(400, "id of the review is required")
    }

    const result=await Review.findByIdAndDelete(id);
    if(result)
    {
        res.status(200).json(new ApiResponse(200,{},"Review deleted successfully"))
    }
    else
    {
        throw new ApiError(404, "Review not found")
    }

})

export {reviewInitiate, reviewVerify, approvedReviews, unapprovedReviews, approveReview, deleteReview}