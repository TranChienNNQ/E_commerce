'use strict'

const { SuccessRespone } = require("../core/success.respone")
const CommentService = require("../services/comment.service")
const { createComment } = require("../services/comment.service")

class CommentControler{
    createComment = async(req, res, next)=>{
        new SuccessRespone({
            message: 'create new comment',
            metadata : await createComment(req.body)
        }).send(res)
    }

    getCommentByParentId = async (req, res, next) =>{
        new SuccessRespone({
            message: 'create new comment',
            metadata: await CommentService.getCommentByParentId(req.query)
    }).send(res)
    }

    deleteComment = async (req, res, next) =>{
        new SuccessRespone({
            message: 'delete success comment',
            metadata: await CommentService.deleteCommnet(req.body)
    }).send(res)
    }
}
module.exports = new CommentControler