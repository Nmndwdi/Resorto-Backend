import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import fs from "fs"

;(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
})()
    
const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const deleteOnCloudinary = async(url)=>{
    try {
        if(!url) return null
        const parts=url.split("/")
        const filename=parts[parts.length-1]
        const publicId=filename.split(".")[0]

        const response=await cloudinary.uploader.destroy(publicId)
        return response

    } catch (error) {
        return "Error"
    }
}

export {uploadOnCloudinary,deleteOnCloudinary}