'use strict'

const { NotFoundError } = require("../core/error.respone")
const { cart } = require("../models/cart.model")
const { getProductById } = require("../models/repositories/product.repo")

class CartService{
    //create cart
    static async createuserCart({userId, product}){
        const query = {cart_userId: userId, cart_state: 'active'},
        updateOrInsert = {
            $addToSet: {
                cart_product: product
            }
        }, options= {upsert: true, new: true}
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    //cap nhat so luong
    static async updateUserCartQuantity({userId, product}){
        const {productId, quantity} = product
        const query = {
            cart_userId: userId,
            'cart_product.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc:{
                'cart_product.$.quantity': quantity
            }
        }, options= {upsert: true, new:true}
        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async deleteUserCart({userId, productId}){
        const query = {
            cart_userId: userId,
            cart_state:'active'
        }, updateSet={
            $pull: {
                cart_products:{
                    productId
                }
            }
        }
        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }
 
    static async addToCart({userId, product = {}}){
        const userCart = await cart.findOne({cart_userId: userId})
        if(!userCart){
            return await CartService.createuserCart({userId, product})
        }
        
        //neu co gio hang nhung chua co san pham
        if(!userCart.cart_products.length){
            userCart.cart_products = [product]
            return await userCart.save()
        }

        //san pham ton tai thi tang so luong
        return await CartService.updateUserCartQuantity({userId, product})

    }

    static async addToCartV2({userId, shop_order_ids = {}}){
        const{productId, quantity, old_quantity} = shop_order_ids[0]?.item_product[0]
        //check product
        const foundProduct = await getProductById(productId)
        if(!foundProduct){
            throw new NotFoundError('Ko tim thay san pham')
        }
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId){
            throw new NotFoundError('Product do not belong to the shop')
        }

        if(quantity === 0){
            //delete
        }
        return await CartService.updateUserCartQuantity({
            userId, product:{
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async getListuserCart({userId}){
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService