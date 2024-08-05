'use strict'

const express = require('express')
const { model } = require('mongoose')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()


//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

//authentication
router.use(authenticationV2)

router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))
module.exports = router