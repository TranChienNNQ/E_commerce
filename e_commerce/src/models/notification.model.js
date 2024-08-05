'use strict'

const{model, Schema} = require('mongoose')
const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

const NotificationSchema = new Schema({
    noti_type:{type:String, enum:['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], reuiqred:true},
    noti_senderId: {type:Schema.Types.ObjectId, required:true,ref:'Shop'},
    noti_content: {type:String, required:true },
    noti_receivedId: {type:Number, required:true},
    noti_options: {type: Object, default:{}}
},{
    timestamps:true,
    collection: COLLECTION_NAME
})
module.exports = {noti: model(DOCUMENT_NAME, NotificationSchema)}