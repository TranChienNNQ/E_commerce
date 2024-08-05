'use strict'

const { SuccessRespone } = require("../core/success.respone")
const DiscountService = require("../services/discount.service")

class DiscountController{
    createDiscountCode = async (req, res, next) => {
        new SuccessRespone({
            message: 'Successful Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCode = async (req, res, next)=>{
        new SuccessRespone({
            message: 'Success get all discount code',
            metadata: await DiscountService.getAllDiscountCodeWithShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next)=>{
        new SuccessRespone({
            message: 'Success get discount amount',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    getAllDiscountCodeWithProduct = async (req, res, next)=>{
        new SuccessRespone({
            message: 'Success get all discount code with product',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res)
    }


}
module.exports = new DiscountController()