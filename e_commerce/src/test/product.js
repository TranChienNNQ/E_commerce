'use strict'

const RedisPubSubService = require("../services/redis.pubsub.service")

class ProductServiceTest{
    purchaseProduct(productId, quantity){
        const order ={
            productId,
            quantity
        }
        RedisPubSubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest