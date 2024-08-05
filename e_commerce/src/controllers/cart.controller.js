'use strict'

const { SuccessRespone } = require("../core/success.respone")
const CartService = require("../services/cart.service")

class CartController{
    addToCart = async (req, res, next) => {
        new SuccessRespone({
            message: 'Create new cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessRespone({
            message: 'Delete cart success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    update = async (req, res, next) => {
        new SuccessRespone({
            message: 'Update  cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        new SuccessRespone({
            message: 'get list cart success',
            metadata: await CartService.addToCart(req.query)
        }).send(res)
    }
}

module.exports = CartController