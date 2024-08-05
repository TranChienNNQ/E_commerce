'use strict'
const express = require('express')
const productController = require('../../controllers/product.controller')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const { asyncHandler } = require('../../helper/asyncHandler')
const router = express.Router()
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))
//authentication
router.use(authenticationV2)
////////
router.post('', asyncHandler(productController.createProduct))
//patch la phuong thuc update 1 thu, ko update all nhu put
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShopublishProductByShop))

//Query//
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))
module.exports = router
