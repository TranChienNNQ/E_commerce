'use strict'

const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3")
const { cloudinary } = require("../configs/cloudinary.config")
const { s3 } = require("../configs/s3aws.config")
const crypto = require('crypto')
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner ')

const urlImagePublic = 'https://d2jodo0i5e78nc.cloudfront.net'

//upload file use s3Client
const randomImageName = ()=>crypto.randomBytes(16).toString('hex')
const uploadImageFromLocalS3 = async({
    file
})=>{
    try{
        
        const imageName = randomImageName()
        const command =new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName || 'unknown',
            Body: file.buffer,
            ContentType: 'image/jpeg' //that is what you need
        })

        const result = await s3.send(command)
        console.log(result)
        const signedUrl = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
        })
        const url = await getSignedUrl(s3, signedUrl,{expiresIn: 3600})
        return {
            url:`${urlImagePublic}/${imageName}`,
            result
        }
        // return{
        //     image_url: result.secure_url,
        //     shopId: 8490,
        //     thumb_url: await cloudinary.url(result.public_id, {
        //         height: 100,
        //         width: 100,
        //         format: 'jpg'
        //     })
        // }

    }catch(error){
        console.error(`Error uploading iamge use S3Client::`, error)
    }
}






/////
//1. Upload from url image
const uploadImageFromUrl = async()=>{
    try{
        const urlImage = 'https://'
        const folderName = 'product/shopId'
        const newFileName = 'testDemo'
        const result = await cloudinary.uploader.upload(urlImage, {
            folder: folderName, 
            newFileName: newFileName
        })
        return result
    }catch(error){
        console.error(`Error uploading image::`, error)
    }
}

//2. upload Frrom file Local
const upLoadImageFromLocal = async({path, folderName='product/8409'})=>{
    try{
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName
        })
        return {
            image_url: result.secure_url,
            shopId: 8409,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format:'jpg'
            })
        }
    }catch(error){
        console.error(`Error uploading image::`, error)
    }
} 
module.exports = {
    uploadImageFromUrl, 
    upLoadImageFromLocal,
    uploadImageFromLocalS3
}