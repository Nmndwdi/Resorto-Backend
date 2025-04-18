import {asyncHandler} from '../utils/AsyncHandler.js'
import {Info} from '../models/info.model.js'
import { ApiError } from '../utils/ApiError.js';
import { deleteOnCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const updateInfo = asyncHandler( async(req,res)=>{
    const data=req.body
    let info=await Info.findOne();
    if(!info) {
        info = new Info({});
    }
    
    Object.keys(data).forEach((key)=>{
        if(data[key] !== undefined && data[key]!==null)
        {
            info[key]=data[key]
        }
    })
    await info.save();
    res.status(200).json(new ApiResponse(200,{},"Info updated successfully"))
})

const updateLogo = asyncHandler( async(req,res)=>{
    const logoLocalPath = req.file?.path
    if(!logoLocalPath)
    {
        throw new ApiError(400, "Logo is missing")
    }
    const logo=await uploadOnCloudinary(logoLocalPath)

    if(!logo.url)
    {
        throw new ApiError(400, "Error while uploading logo")
    }

    const info=await Info.findOne()

    const url=info.logo

    info.logo=logo.url
    await info.save()

    const deleteRes=await deleteOnCloudinary(url)

    if(deleteRes=="Error")
    {
        throw new ApiError(500,"logo can't be deleted successfully")
    }

    res.status(200).json(new ApiResponse(200,{},"logo image updated successfully"))
})

const addInHomeImages=asyncHandler(async(req,res)=>{
    
    if(!req.files || req.files.length===0)
    {
        throw new ApiError(400,"Images not found")
    }
    
    const uploadedImages=[]
    for(const file of req.files)
    {
        const image=await uploadOnCloudinary(file.path)
        if(!image.url)
        {
            throw new ApiError(400, "Image can't be uploaded")
        }
        uploadedImages.push(image.url);
    }

    const info=await Info.findOne()
    info.home_images.push(...uploadedImages)
    
    await info.save();

    res.status(200).json(new ApiResponse(200,{},"Images added successfully"))
})

const removeFromHomeImages=asyncHandler( async(req,res)=>{
    const {index} = req.body

    const info=await Info.findOne()

    if(index==null || index>=info.home_images.length) {
        throw new ApiError(400, "No image to be deleted")
    }
    
    const deleteRes=await deleteOnCloudinary(info.home_images[index])
    if(deleteRes==="Error")
    {
        throw new ApiError(500,"Image can't be deleted")
    }

    info.home_images.splice(index,1)
    
    await info.save()

    res.status(200).json(new ApiResponse(200,{},"Image removed successfully"))
})

const updateInHomeImages = asyncHandler( async(req,res)=>{
    const {index} = req.body
    const logoLocalPath = req.file?.path
    if(!logoLocalPath)
    {
        throw new ApiError(400, "Image is missing")
    }

    const info=await Info.findOne()

    if(index==null || index>=info.home_images.length) {
        throw new ApiError(400, "Wrong index provided to be updated")
    }
    
    const image=await uploadOnCloudinary(logoLocalPath)

    if(!image.url)
    {
        throw new ApiError(400, "Error while uploading image")
    }

    const url=info.home_images[index];

    info.home_images[index]=image.url
    await info.save()

    const deleteRes=await deleteOnCloudinary(url)

    if(deleteRes=="Error")
    {
        throw new ApiError(500,"image can't be deleted successfully")
    }

    res.status(200).json(new ApiResponse(200,{},"image updated successfully"))
})

const addEventOption = asyncHandler( async(req,res)=>{
    const {title,description} = req.body

    if(!title && !description)
    {
        throw new ApiError(400, "Atleast one thing is required")
    }

    const info=await Info.findOne()
    info.event_options.push({title,description})
    await info.save()
    res.status(200).json(new ApiResponse(200,{},"Event added successfully"))
})

const removeEventOption = asyncHandler( async(req,res)=>{
    const {index}=req.body

    const info=await Info.findOne()
    if(index==null || index>=info.event_options.length)
    {
        throw new ApiError(400,"Wrong Event index")
    }
    
    info.event_options.splice(index,1)
    await info.save()

    res.status(200).json(new ApiResponse(200,{},"Event deleted successfully"))
})

const updateEventOption = asyncHandler( async(req,res)=>{
    const {index, title, description}=req.body

    const info=await Info.findOne()

    if(index==null || index>=info.event_options.length)
    {
        throw new ApiError(400, "Wrong event index provided")
    }
    if(!title && !description)
    {
        throw new ApiError(400, "Atleast one thing is required")
    }

    const prevTitle=info.event_options[index]?.title
    const prevDescription=info.event_options[index]?.description
    info.event_options[index] = {
        title: title || prevTitle,
        description: description || prevDescription
    };

    await info.save()
    
    res.status(200).json(new ApiResponse(200,{},"Event updated successfully"))
})

const addMainInfo = asyncHandler( async(req,res)=>{
    const {heading,content} = req.body

    if(!heading && !content)
    {
        throw new ApiError(400, "Atleast one thing is required")
    }

    const info=await Info.findOne()
    info.main_info.push({heading,content})
    await info.save()
    res.status(200).json(new ApiResponse(200,{},"Info added successfully"))
})

const removeMainInfo = asyncHandler( async(req,res)=>{
    const {index}=req.body
    
    const info=await Info.findOne()
    if(index==null || index>=info.main_info.length)
    {
        throw new ApiError(400,"Wrong Main Info index")
    }
    
    info.main_info.splice(index,1)
    await info.save()

    res.status(200).json(new ApiResponse(200,{},"Info deleted successfully"))
})

const updateMainInfo = asyncHandler( async(req,res)=>{
    const {index, heading, content}=req.body

    const info=await Info.findOne()

    if(index==null || index>=info.main_info.length)
    {
        throw new ApiError(400, "Wrong event index provided")
    }
    if(!heading && !content)
    {
        throw new ApiError(400, "Atleast one thing is required")
    }

    const prevHeading=info.main_info[index]?.heading
    const prevContent=info.main_info[index]?.content
    
    info.main_info[index] = {
        heading: heading || prevHeading,
        content: content || prevContent
    };
    await info.save()
    
    res.status(200).json(new ApiResponse(200,{},"Info updated successfully"))
})

const addGallery = asyncHandler( async(req,res)=>{
    const {title} = req.body

    if(!req.files || req.files.length===0)
    {
            throw new ApiError(400,"Images not found")
    }
    
    const uploadedImages=[]
    for(const file of req.files)
    {
        const image=await uploadOnCloudinary(file.path)
        if(!image.url)
        {
            throw new ApiError(400, "Image can't be uploaded")
        }
        uploadedImages.push(image.url);
    }
    
    const info=await Info.findOne()
    info.gallery.push({ title, media: uploadedImages });
    
    await info.save();
    
    res.status(200).json(new ApiResponse(200,{},"Gallery added successfully"))
})

const removeGallery = asyncHandler( async(req,res)=>{
    const {index} = req.body

    const info=await Info.findOne()

    if(index==null || index>=info.gallery.length)
    {
            throw new ApiError(400,"Wrong Gallery index")
    }
        
    const images=info.gallery[index].media
    for(const url of images)
    {
        const res=await deleteOnCloudinary(url)
        if(res==="Error")
        {
            throw new ApiError(400, "Image can't be deleted")
        }
    }
    
        
    info.gallery.splice(index,1)
        
    await info.save();
    
    res.status(200).json(new ApiResponse(200,{},"Gallery deleted successfully"))
})

const updateGalleryTitle = asyncHandler( async(req,res)=>{
    const {index,title}=req.body
    const info=await Info.findOne()
    if(index==null || index>=info.gallery.length)
    {
        throw new ApiError(400, "Wrong Index")
    }
    if(!title)
    {
        throw new ApiError(400, "Title required")
    }
    info.gallery[index].title=title
    await info.save()

    res.status(200).json(new ApiResponse(200,{},"Title of the gallery updated successfully"))
})

const addInGallery=asyncHandler(async(req,res)=>{
    const {index}=req.body
    if(!req.files || req.files.length===0)
    {
        throw new ApiError(400,"Images not found")
    }
    const info=await Info.findOne()

    if(index==null || index>=info.gallery.length)
    {
        throw new ApiError(400, "Wrong gallery index")
    }
    
    const uploadedImages=[]
    for(const file of req.files)
    {
        const image=await uploadOnCloudinary(file.path)
        if(!image.url)
        {
            throw new ApiError(400, "Image can't be uploaded")
        }
        uploadedImages.push(image.url);
    }

    info.gallery[index].media.push(...uploadedImages)
    
    await info.save();

    res.status(200).json(new ApiResponse(200,{},"Images in gallery added successfully"))
})

const removeFromGallery=asyncHandler( async(req,res)=>{
    const {index, subIndex} = req.body
    const info=await Info.findOne()

    if(index==null || index>=info.gallery.length) {
        throw new ApiError(400, "Wrong gallery index")
    }

    if(subIndex==null || subIndex>=info.gallery[index].media.length)
    {
        throw new ApiError(400, "Wrong subIndex in gallery")
    }
    
    const deleteRes= await deleteOnCloudinary(info.gallery[index].media[subIndex])

    if(deleteRes==="Error")
    {
        throw new ApiError(500,"Image can't be deleted")
    }

    info.gallery[index].media.splice(subIndex,1)
    if(info.gallery[index].media.length==0)
    {
        info.gallery.splice(index,1)
    }
    
    await info.save()

    res.status(200).json(new ApiResponse(200,{},"Image removed successfully"))
})

const updateInGallery = asyncHandler( async(req,res)=>{
    const {index,subIndex} = req.body
    const logoLocalPath = req.file?.path
    if(!logoLocalPath)
    {
        throw new ApiError(400, "Image is missing")
    }

    const info=await Info.findOne()

    if(index==null || index>=info.gallery.length) {
        throw new ApiError(400, "Wrong index provided to be updated in gallery")
    }
    if(subIndex==null || subIndex>=info.gallery[index].media.length)
    {
        throw new ApiError(400, "Wrong subindex provided to be updated in gallery")
    }
    
    const image=await uploadOnCloudinary(logoLocalPath)

    if(!image.url)
    {
        throw new ApiError(400, "Error while uploading image")
    }

    const url=info.gallery[index].media[subIndex];

    info.gallery[index].media[subIndex]=image.url
    await info.save()

    const deleteRes=await deleteOnCloudinary(url)

    if(deleteRes=="Error")
    {
        throw new ApiError(500,"image can't be deleted successfully")
    }

    res.status(200).json(new ApiResponse(200,{},"image updated successfully"))
})

export {updateInfo, updateLogo, addInHomeImages,removeFromHomeImages,addEventOption,removeEventOption,updateEventOption, updateInHomeImages,addMainInfo,removeMainInfo,updateMainInfo,addGallery,removeGallery,updateGalleryTitle,addInGallery,removeFromGallery,updateInGallery}