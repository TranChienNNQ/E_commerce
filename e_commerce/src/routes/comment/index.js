'use strict'

const express = require('express')
const { authenticationV2 } = require('../../auth/authUtils')
const { asyncHandler } = require('../../auth/checkAuth')
const commentController = require('../../controllers/comment.controller')
const router = express.Router()

router.use(authenticationV2)
router.post('', asyncHandler(commentController.createComment))
router.post('/get_list', asyncHandler(commentController.getCommentByParentId))
router.post('/delete_comment', asyncHandler(commentController.deleteComment))

module.exports = router