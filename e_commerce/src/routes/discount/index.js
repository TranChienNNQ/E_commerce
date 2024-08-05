'use strict'


const express = require('express')
const { asyncHandler } = require('../../auth/checkAuth')
const DiscountController = require('../../controllers/discount.controller')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

//get amout a discount
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/list_product_shop', asyncHandler(DiscountController.getAllDiscountCodeWithProduct))

router.use(authenticationV2)
router.post('', asyncHandler(DiscountController.createDiscountCode))
router.get('', asyncHandler(DiscountController.getAllDiscountCodeWithProduct))
module.exports = router