'use strict'

const { BadRequestError } = require("../core/error.respone")
const { SuccessRespone } = require("../core/success.respone")
const { uploadImageFromUrl, upLoadImageFromLocal, uploadImageFromLocalS3 } = require("../services/upload.service")

class UploadController{
    uploadFile = async(req, res, next)=> {
        new SuccessRespone({
            message: 'Upload success',
            metadata: await uploadImageFromUrl()
        }).send(res)
    }

    uploadFileFromLocal = async(req, res, next)=> {
        const {file} = req
        if(!file){
            throw new BadRequestError(`file ko ton tai`)
        }
        new SuccessRespone({
            message: 'Upload success',
            metadata: await upLoadImageFromLocal({
                path:file.path
            })
        }).send(res)
    }

    uploadFileFromLocalS3 = async(req, res, next)=> {
        const {file} = req
        if(!file){
            throw new BadRequestError(`file ko ton tai`)
        }
        new SuccessRespone({
            message: 'Upload success',
            metadata: await uploadImageFromLocalS3({
                file
            })
        }).send(res)
    }
}
module.exports = new UploadController()
