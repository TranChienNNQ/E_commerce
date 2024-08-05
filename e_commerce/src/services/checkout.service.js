'use strict'

const { BadRequestError } = require("../core/error.respone")
const { findByCartId } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const { releaseLock } = require("./redis.service")

class CheckoutService{
    static async checkoutReview({
        carrId, userId, shop_order_ids
    }){
        //check cartId cos ton ai ko
        const foundCart = await findByCartId(cartId)
        if(!foundCart){throw new BadRequestError('Cart not exists')}

        const checkout_order = {
            totalPrice: 0, // tong tien hang
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout:0
        }, shop_order_ids_new= []

        // tinh tong tien Bill
        for (let i =0; i<shop_order_ids.lenght; i++){
            const{shopId, shop_discount=[], items_products = []}= shop_order_ids[i]
            const checkProductServer = await checkProductByServer(items_products)
            if(!checkProductByServer){ throw new BadRequestError('order wrong!!!')}
            
            const checkoutPrice = checkProductByServer.reduce((acc, product)=>{
                return acc + (product.quantity*product.price)
            }, 0)

            //tong tien truoc khi xu ly
            checkout_order.totalPrice =+ checkoutPrice
            const itemCheckout  = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            if(shop_discounts.lenght > 0){
                const {totalPrice = 0, discount= 0} = await getDiscountAmount({
                    codeId: shop_discount[0].codeId,
                    userId,
                    shopId,
                    products: checkProductByServer
                })
                checkout_order.totalDiscount += discount

                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkPrice - discount
                }
            }
            //tong tien thanh toan cuoi cung
            checkout_order.totalCheckout  += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }){ 
        const {shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })
        //check lai mot lan nua xem vuojt ton kho hay ko
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        const acquireProduct = []
        for(let i = 0; i< products.lenght; i++){
            const{productId, quantity} = products[i];
            const keyLock = await acquiredLock(productId, quantity, cartId)
            acquireProduct.push(keyLock? true : false)
            if (keyLock){
                await releaseLock(keyLock)
            }
        }

        //check if co mot san pham het hang trong kho
        if(acquireProduct.includes(false)){
            throw new BadRequestError('Mot so san pham da duoc cap nhat, vui long quay laji gio hang')
        }
        
        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: ship_order_ids_new
        })
        if(newOrder){

        }
        return newOrder 
    }

    static async getOrderByUser(){}
    static async getOneOrderByUser(){}
    static async cancelOrderByUser(){}
    static async updateOrderStatusByShop(){}
}
module.exports = CheckoutService