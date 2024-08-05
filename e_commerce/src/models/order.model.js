'use strict'

const{model, Schema, Types} = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId:{type: Number, required:true},
    order_checkout:{type: Object, default:{}},
    order_payment:{type: Object, default:{}},
    order_product:{type:Array, required:true},
    order_trackingNumber: {type: String, default: '#01010101'},
    order_status:{type:String, enum:['pending', 'skipped', 'cancel', 'delivered'], default: 'pending'}
},{
    collection: COLLECTION_NAME,
    timestamps:{
        createdAt: 'createOn',
        updatedAt: 'modifiedOn'
    }
})

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}