'use strict'

const express = require('express')
const { asyncHandler } = require('../../auth/checkAuth')
const CartController = require('../../controllers/cart.controller')
const router = express.Router()

router.post('', asyncHandler(CartController.addToCart))
router.delete('', asyncHandler(CartController.delete))
router.post('/update', asyncHandler(CartController.update))
router.get('', asyncHandler(CartController.listToCart))



module.exports = router