import { Info } from "../models/info.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getHeaderInfo = asyncHandler( async(req,res)=>{
    const info=await Info.findOne()
    if(!info)
    {
        throw new ApiError(500, "No data available")
    }
    const headerData={
        logo: info.logo,
        title: info.title,
        phone_no: info.phone_no,
        address: info.address
    }
    res.status(200).json(new ApiResponse(200,headerData,"Header Data Retrieved successfully"))
})

const getFooterInfo = asyncHandler( async(req,res)=>{
    const info=await Info.findOne()
    if(!info)
    {
        throw new ApiError(500, "No data available")
    }
    const footerData={
        name: info.name,
        phone_no: info.phone_no,
        address: info.address,
        description: info?.description || '',
        linkedin: info?.linkedin || '',
        instagram: info?.instagram || '',
        facebook: info?.facebook || '',
        twitter: info?.twitter || '',
        email: info?.email || 'abc@gmail.com',
    }
    res.status(200).json(new ApiResponse(200,footerData,"Footer Data Retrieved successfully"))
})

const getHomeInfo = asyncHandler( async(req,res)=>{
    const info=await Info.findOne()
    if(!info)
    {
        throw new ApiError(500, "No data available")
    }
    const homeData={
        home_images: info?.home_images || [],
        short_about_heading: info?.short_about_heading || '',
        short_about_description: info?.short_about_description || '',
        event_options: info?.event_options || []
    }
   res.status(200).json(new ApiResponse(200,homeData,"Home Data Retrieved successfully"))
})

const getAboutInfo = asyncHandler( async(req,res)=>{
    const info=await Info.findOne()
    if(!info)
    {
        throw new ApiError(500, "No data available")
    }
    const aboutData={
        about_heading: info?.about_heading || '',
        about_description: info?.about_description || '',
    }
   res.status(200).json(new ApiResponse(200,aboutData,"About Data Retrieved successfully"))
})

const getContactInfo = asyncHandler( async(req,res)=>{
    const info=await Info.findOne()
    if(!info)
    {
        throw new ApiError(500, "No data available")
    }
    const contactData={
        whatsApp_number: info?.whatsApp_number || '',
        calling_number: info?.calling_number || '',
    }
   res.status(200).json(new ApiResponse(200,contactData,"Contact Data Retrieved successfully"))
})

const getPricingInfo = asyncHandler( async(req,res)=>{
    const info=await Info.findOne()
    if(!info)
    {
        throw new ApiError(500, "No data available")
    }
    const PricingInfo={
        main_info: info.main_info
    }
    res.status(200).json(new ApiResponse(200,PricingInfo,"Pricing Data Retrieved successfully"))
})

const getGalleryInfo = asyncHandler(async(req,res)=>{
    const info=await Info.findOne()
    if(!info)
    {
        throw new ApiError(500, "No data available")
    }
    const galleryInfo={
        gallery: info.gallery
    }
    res.status(200).json(new ApiResponse(200,galleryInfo,"Gallery Data Retrieved successfully"))
})

const getAdminData = asyncHandler( async(req,res)=>{
    const info = await Info.findOne()
    if(!info)
    {
        throw new ApiError(500, "No Data available")
    }
    const adminData={
        title: info.title,
        phone_no: info.phone_no,
        address: info.address,
        short_about_heading: info.short_about_heading,
        short_about_description: info.short_about_description,
        about_heading: info.about_heading,
        about_description: info.about_description,
        name: info.name,
        description: info.description,
        linkedin: info.linkedin,
        instagram: info.instagram,
        facebook: info.facebook,
        twitter: info.twitter,
        email: info.email,
        whatsApp_number: info.whatsApp_number,
        calling_number: info.calling_number,
        logo: info.logo,
        home_images: info.home_images,
        event_options: info.event_options,
        gallery: info.gallery,
        main_info: info.main_info
    }
    res.status(200).json(new ApiResponse(200,adminData,"Admin Data Retrieved successfully"))
})

export {getHeaderInfo,getFooterInfo,getHomeInfo,getAboutInfo,getContactInfo,getPricingInfo,getGalleryInfo, getAdminData}