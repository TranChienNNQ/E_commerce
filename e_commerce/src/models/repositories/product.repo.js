'use strict'
const {Types} = require('mongoose')
const {product, electronic, clothing, furniture} = require('../../models/product.model')
const { getSelectData, unGetSelectData, convertObjectIdMongo } = require('../../utils')
const findAllDraftsForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const findAllPublishForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}
const findAllProducts = async({limit, sort, page, filter, select})=>{
    const skip = (page -1)*limit;
    const sortBy = sort === 'ctime'? {_id: -1} : {_id: 1}
    const products = await product.find (filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return products
} 

const findProduct = async ({product_id, unSelect}) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect ))
}

const searchProductByUesr = async({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const result = await product.find({
        isPublished:true,
        $text: {$search: regexSearch}},
        {score:{$meta:'textScore'}}
).sort({score:{$meta:'textScore'}}).lean()
    return result
}

const publishProductbyShop = async({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop){
        return null
    }
    foundShop.isDraft = false
    foundShop.isPublished = true
    const {modifiedCount} = await foundShop.update(foundShop)
    return modifiedCount
}

const unPublishProductByShop = async() =>{
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop){
        return null
    }
    foundShop.isDraft = true
    foundShop.isPublished = false
    const {modifiedCount} = await foundShop.update(foundShop)
    return modifiedCount
}
const queryProduct = async({query, limit, skip}) => {
    return (await product.find(query)
    .populate('product_shop', 'name email -_id'))
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()

}

const updateProductbyId = async({
    productId,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}

const getProductById = async(productId)=>{
    return await product.findOne({_id: convertObjectIdMongo(productId)}).lean()
}

const checkProductByServer = async(products) => {
    return await Promise.all(product.map(async product => {
        const foundProduct = await getProductById(product.productId)
        if(foundProduct){
            return{
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId
            }
        }
    }))
}



module.exports = {
    findAllDraftsForShop,
    publishProductbyShop ,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUesr,
    findAllProducts, 
    findProduct,
    updateProductbyId,
    getProductById,
    checkProductByServer
}