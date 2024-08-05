'use strict'

const {model, Types, Schema} = require('mongoose')
const { product } = require('./product.model')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema({
    discount_name: {type: String, require: true},
    discount_description: {type:String, require: true},
    discount_type: {type: String, default:'fix_mount'}, //percentage
    discount_value: {type: Number, require: true},
    discount_code: {type: String, require:true},
    discount_start_date: {type: Date, require: true},
    discount_end_date: {type: Date, require: true},
    discount_max_uses: {type: Number, require:true},
    discount_user_count:{type: Number, require: true}, // so discount da su dung
    discount_users_used:{type: Array, default: []},
    discount_max_uses_per_user:{type: Number, require:true}, // So luong cho phep toi da tren 1 user
    discount_min_order_value: {type: Number, require: true},
    discount_max_order_value: {type: Number, require: true},
    discount_shopId: {type: Schema.Types.ObjectId, ref: 'Shop'},
    discount_is_active: {type: Boolean, default: true},
    discount_applies_to: {type:String, require: true, enum:['all', 'specific']},
    discount_product_ids: {type: Array, default: []} //so san pham duoc ap dung
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


module.exports = {
    discount: model(DOCUMENT_NAME, discountSchema)
}