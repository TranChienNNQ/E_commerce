'use strict'
const express = require('express')
const { asyncHandler } = require('../../auth/checkAuth')
const ChekoutController = require('../../controllers/checkout.controller')
const router = express.Router()

router.post('/revivew', asyncHandler(ChekoutController.checkoutReview))
module.exports = router