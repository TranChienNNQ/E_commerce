'use strict'

const express = require('express')
const { model } = require('mongoose')
const { apiKey, permission } = require('../auth/checkAuth')
const { product } = require('../models/product.model')
const router = express.Router()

//checkAPIKey
router.use(apiKey)

//check permission
router.use(permission('0000'))


router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/inventory', require('./inventory'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api', require('./access/index'))
router.use('vi/api/discount', require('./discount'))
router.use('vi/api/cart', require('./cart'))
router.use('v1/api/upload', require('./upload'))
router.use('/v1/api/notification', require('./notification'))
// router.get('', (req, res, next)=>{
//     return res.status(200).json({
//         message: 'Welcome',
//     })
// })


module.exports = router
 