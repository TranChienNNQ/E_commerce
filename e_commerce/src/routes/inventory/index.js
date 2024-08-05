'use strict'

const express = require('express')
const { authenticationV2 } = require('../../auth/authUtils')
const { asyncHandler } = require('../../auth/checkAuth')
const InventoryController = require('../../controllers/inventory.controller')

const router = express.Router()
router.use(authenticationV2)

router.post('', asyncHandler(InventoryController.addStockToInventory))

module.exports = router