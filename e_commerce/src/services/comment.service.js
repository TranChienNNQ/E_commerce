'use strict'

const { findProduct } = require("../controllers/product.controller")
const { NotFoundError } = require("../core/error.respone")
const { product } = require("../models/product.model")
const { convertObjectIdMongo } = require("../utils")


class CommentService{
    static async createComment({
        productId, userId, content, parentCommentId= null
    }){
        const comment = new Comment({
            comment_productId: productId,
            comment_userId : userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue
        if(parentCommentId){
            const parentComment = await Comment.findById(parentCommentId)
            if(!parentComment){ throw new NotFoundError(`comment ko ton tai`)}
            rightValue = parentComment.comment_right
            //update many
            await Comment.updateMany({
                comment_productId: convertObjectIdMongo(productId),
                comment_right: {$gte: rightValue}
            },{
                $inc: {comment_right:2}
            })
            await Comment.updateMany({
                comment_productId: convertObjectIdMongo(productId),
                comment_left: {$gte: rightValue}
            },{
                $inc: {comment_left:2}
            })
        }else{
            const maxRightValue = await Comment.findOne({
                comment_productId: convertObjectIdMongo(productId)
            }, 'comment_right', {sort: {comment_right: -1}})
            if(maxRightValue){
                rightValue = maxRightValue.right +1
            }else{
                rightValue = 1
            }
        }
        //insert comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue +1
        await comment.save()
        return comment
    }

    static async getCommentByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0
    }){
        if(!parentCommentid){
            const parent =  await Comment.findById(parentCommentId)
            if(!parent) throw new NotFoundError(`Not found comment for product`)

            const comments = await Comment.find({
                comment_productId: convertObjectIdMongo(productId),
                comment_left: {$gt:parent.comment_left},
                comment_right: {$lte: parent.comment_right}
            }).select({
                comment_left:1,
                comment_right: 1,
                comment_content:1, 
                conmment_parentId:1
            }).sort({
                comment_left:1
            })
            return comments
        }
        const comments = await Comment.find({
            comment_productId: convertObjectIdMongo(productId),
            comment_parentId: convertObjectIdMongo(parentCommentId)
        }).select({
            comment_left:1,
            comment_right: 1,
            comment_content:1, 
            conmment_parentId:1
        }).sort({
            comment_left:1
        })
        return comments
    }

    static async deleteCommnet({
        commentId, productId
    }){
        //check the product exist in the data base
        const foundProduct = await findProduct({
            product_id: productId
        })
        if(!foundProduct) throw new NotFoundError(` ko tim thay cmt`)
        const comment = await Comment.findById(commentId)
        if(!comment) throw new NotFoundError(`Cmt ko ton tai`)
        
        const leftValue = comment.comment_left
        const rightValue = comment.comment_right
        //tinnh chieu rong 
        const width = rightValue - leftValue + 1
        await Comment.deleteMany({
            comment_productId: convertObjectIdMongo(productId),
            comment_left: {$gte: leftValue, $lte: rightValue}
        })

        await Comment.updateMany({
            comment_productId: convertObjectIdMongo(productId),
            comment_right: {$gte: rightValue}
        },{
            $inc: {comment_right: -width}
        })

        await Comment.updateMany({
            comment_productId: convertObjectIdMongo(productId),
            comment_left: {$gte: rightValue}
        },{
            $inc: {comment_right: -width}
        })
        return true 
    }
}

module.exports = CommentService