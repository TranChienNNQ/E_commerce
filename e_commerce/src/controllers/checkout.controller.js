'use strict'

const { SuccessRespone } = require("../core/success.respone")
const CheckoutService = require("../services/checkout.service")

class ChekoutController{
    checkoutReview = async (req, res, next) => {
        new SuccessRespone({
            message: 'create new Cart Success',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}

module.exports = new ChekoutController