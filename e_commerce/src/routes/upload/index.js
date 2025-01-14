'use strict'

const express = require('express')
const { authenticationV2 } = require('../../auth/authUtils')
const { asyncHandler } = require('../../helper/asyncHandler')
const uploadController = require('../../controllers/upload.controller')
const { uploadDisk, uploadMemory } = require('../../configs/multer.config')
const router = express.Router()

router.use(authenticationV2)

router.post('/product', asyncHandler(uploadController.uploadFile()))
router.post('/product/thumb',uploadDisk.single('file'), asyncHandler(uploadController.uploadFileFromLocal()))
router.post('/product/bucket',uploadMemory.single(file), asyncHandler(uploadController.uploadFileFromLocalS3()))
module.exports= router()