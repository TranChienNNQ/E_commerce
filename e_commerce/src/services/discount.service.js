'use strict'

const { filter } = require("lodash")
const { BadRequestError, NotFoundError } = require("../core/error.respone")
const { discount } = require("../models/discount.model")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertObjectIdMongo } = require("../utils")
const { findOne } = require("../models/apikey.model")
const { checkDiscountExists } = require("../models/repositories/discount.repo")


/**
 Discount Service
 1- Generator Discount Code [Shop|Admin]
 2- Get Discount amount [user]
 3- Get all discount code - U/S
 4- Delete discount Code - A/S
 5- Cancel discount code - U
 */

 class DiscountService {
    static async createDiscount(payload){
        const {
            code, start_date, end_date, is_active, shopId,
            min_order_value, product_ids, name, description,
            type, value, max_value, max_uses,
            max_uses_peer_user,uses_count,users_used, applies_to
        } = payload
        if(new Date()< new Date(start_date) || new Date()> new Date(end_date)){
            throw new BadRequestError('Discount code has expried')
        }
        if(new Date(start_date) > new Date(end_date)){
            throw new BadRequestError('Time invalid')
        }
        //create idx for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertObjectIdMongo(shopId),
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active == true){
            throw new BadRequestError('Discount exists!')
        }
        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type, //percentage
            discount_value: value,
            discount_code: code,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_max_uses: max_uses,
            discount_user_count:uses_count, // so discount da su dung
            discount_users_used:users_used,
            discount_max_uses_per_user:max_uses_peer_user, // So luong cho phep toi da tren 1 user
            discount_min_order_value: min_order_value,
            discount_max_order_value: max_value,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids //so san pham duoc ap dung
        })
        return newDiscount
    }

    static async updateDiscountCode(){
            /*
            ...
            */
    }

    static async getAllDiscountCodeWithProduct({
        code, shopId, userId, limit, page
    }){
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertObjectIdMongo(shopId),
        }).lean()
        if(!foundDiscount || foundDiscount.discount_is_active == false){
            throw new BadRequestError('Discount not exists')
        }
        const{discount_applies_to, discount_product_ids} = foundDiscount
        let products
        if(discount_applies_to === 'all'){
            //getAllProduct
            products = await findAllProducts({
                filter: {
                    _id:{$in: discount_product_ids},
                    isPublished: true,
                    limit: +limit,
                    sort: 'ctime',
                    select: ['product_name']
                }
            })
            return products
        }
        if(discount_applies_to == 'specific'){
            //getSpecificProduct ids
        }
    }

    /*
    get all discount code of shop
    */
    
    static async getAllDiscountCodeWithShop({
        limit, page, shopId
    }){
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertObjectIdMongo(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        })

        return discounts
    }
 /**
  * discount code apply
  */
    static async getDiscountAmount({codeId, userId, shopId, products}){
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: convertObjectIdMongo(shopId)
            }
            })

            if(!foundDiscount){throw new NotFoundError(`Discount doesn't exists`)}
            const{
                discount_is_active,
                discount_max_uses,
                discount_end_date, 
                discount_start_date,
                discount_max_uses_per_user
            } = foundDiscount
            if(!discount_is_active){
                throw new NotFoundError(`Discount expried`)
            }
            if(!discount_max_uses){
                throw new NotFoundError(`Discount aet out`)
            }
            if(new Date() < new Date(discount_start_date) || new Date()>new Date(discount_end_date)){
                throw new NotFoundError(`discount code has expried`)
            }

            //check xem co set gia tri toi thieu ko
            let totalOrder = 0
            if(discount_min_order_value > 0){
                //get total
                totalOrder = products.reduce((acc, product) =>{
                    return acc + (product.quantity* product.price)
                },0)
                if(totalOrder < discount_min_order_value){
                    throw new NotFoundError(`don hang nho hon gia tri min`)
                }             
            }

            if(discount_max_uses_per_user > 0){
                const userUseDiscount = discount_users_use.find(user => user.user.Id === userId)
                if(userUseDiscount){
                    //....
                }
            }
            //check xem discount nay la fixed  mount
            const amount = discount_type === 'fixed_amount'?discount_value : totalOrder*(discount_value/100)
            return{
                totalOrder,
                discount:amount,
                totalPrice: totalOrder - amount
            }
        }

        static async deleteDiscountCode({shopId, codeId}){
            const deleted = await  discount.findOneAndDelete({
                discount_code: codeId,
                discount_shopId: shopId
            })
            return deleted
        }

        static async cancelDiscountCode({codeId, shopId, userId}){
            const foundDiscount = await checkDiscountExists({
                model: discount,
                filter:{
                    discount_code: codeId,
                    discount_shopId: convertObjectIdMongo(shopId)
                }
            })

            if(!foundDiscount){
                throw new NotFoundError(`discount does not exist`)
            }
            const result = await discount.findByIdAndUpdate(foundDiscount._id,{
                $pull: {
                    discount_users_used: userId
                },
                $inc: {
                    discount_max_uses:1,
                    discount_uses_count: -1
                }
            })
            return result
        }    
 }

 module.exports = new DiscountService



