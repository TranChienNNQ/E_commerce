const { convertObjectIdMongo } = require("../../utils")
const { inventory } = require("../inventory.model")
const{Types} = require('mongoose')
const insertInventory = async({
    productId, shopId, stock, location = 'unKnow'
}) =>{
    return await inventory.create({
        inventory_productId: productId,
        inventory_stock: stock,
        inventory_location: location,
        inventory_shopId: shopId,
    })
}

const reservationInventory = async ({productId, quantity, carId}) => {
    const query = {
        inven_productId: convertObjectIdMongo(productId),
        inven_stock: {$gte: quantity}
    }, updateSet = {
        $inc:{
            inven_stock: -quantity
        },
        $push:{
            inven_reservation:{
                quantity, 
                cardId,
                createOn: new Date()
            }
        }
    }, option = {
        upsert: true,
        new: true
    }
    return await inventory.updateOne(query, updateSet)
}
module.exports = {
    insertInventory,
    reservationInventory  
}