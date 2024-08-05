'use strict'

const { SuccessRespone } = require("../core/success.respone")
const { InventoryService } = require("../services/inventory.service")

class InventoryController{
    addStockToInventory = async(req, res, next) =>{
        new SuccessRespone({
            message:'Create new Cart addStockToInventory',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}
module.exports =new InventoryController
