'use strict'
const RedisPubSubService = require('../services/redis.pubsub.service')
class InventoryServiceTest{
    constructor(){
        RedisPubSubService.publish('purchase_events', (channel, message)=>{
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory({productId, quantity}){
        console.log(`update inventory ${productId} with quantity ${quantity}`)
    }
}

module.exports = new InventoryServiceTest() 