'use strict'
const { BadRequestError } = require('../core/error.respone')
const{product, clothing, electronic, furniture} = require('../models/product.model')
const { insertInventory } = require('../models/repositories/inventory.repo')
const { findAllDraftsForShop, publishProductbyShop, findAllPublishForShop, unPublishProductByShop, searchProductByUesr, findAllProducts, updateProductbyId } = require('../models/repositories/product.repo')
const { removeUndefineObject, updateNestedObjectParser } = require('../utils')
const { pushNotitoSystem } = require('./notification.service')

//defined Factory class to create product
class ProductFactory{
    static productRegistry ={}
    
    static registryProductType(type, classRef){
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type, payload){
        /*
        type: Clothing
        payload: info product
        */
       switch(type){
        case 'Electronics':
            return new Electronics(payload).createProduct()
        case 'Clothing':
            return new Clothing(payload).createProduct()
        case 'Furniture':
            return new Furniture(payload).createProduct()
        default:
            throw new BadRequestError(`Invalid Product type ${type}`)
       }
    }
    
    static async updateProduct(type, productId, payload){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product type ${type}`)
        
        return new productClass(payload).updateProduct(productId)
    }
    //publish product by Shop
    static async publishProductByShop({product_shop, product_id}){
        return await publishProductbyShop({
            product_shop,
            product_id
        })
    }

    static async unPublishProductByShop({product_shop, product_id}){
        return await unPublishProductByShop({product_shop, product_id})
    }

    ///queyry
    static async findAllDraftsForShop( {product_shop, limit = 50, skip = 0}){
        const query = {product_shop, isDraft: true}
        return await findAllDraftsForShop({query, limit, skip})
    }

    static async findAllPublishForShop( {product_shop, limit = 50, skip = 0}){
        const query = {product_shop, isPublished: true}
        return await findAllPublishForShop({query, limit, skip})
    }

    static async searchProduct({keySearch}){
        return await searchProductByUesr({keySearch})
    }

    static async findAllProducts({limit = 50, sort = 'ctime', page =1, filter ={isPublished:true}}){
        return await findAllProducts({limit, sort, filter, page,
            select: ['product_name', 'product_price', 'product_thumb', 'product_shop']
        })
    }
 
    static async findProduct({product_id}){
        return await findProduct({product_id, unSelect: ['__v']})
    }

}



class Product{
    constructor({product_name, product_thumb, product_description, product_price,
        product_type, product_shop, product_attributes, product_quantity
    }){
        this.product_name= product_name
        this.product_thumb= product_thumb
        this.product_description= product_description
        this.product_price= product_price
        this.product_type= product_type
        this.product_shop= product_shop
        this.product_attributes= product_attributes
        this.product_quantity= product_quantity
    }

    //create new Product
    async createProduct(product_id){
        const newProduct = await product.create({...this, _id: product_id})
        if(!newProduct){
            insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
        })
        //pusd noti
        pushNotitoSystem({
            type: 'SHOP-001',
            receivedId: 1,
            senderId:this.product_shop,
            options:{
                product_name: this.product_name,
                shop_name: this.product_shop
            }
        }).then(rs => console.log(rs)).catch(console.error)
        }
        return newProduct
    }

    //update new product
    async updateProduct(product_id, bodyUpdate){
        return await updateProductbyId({product_id, bodyUpdate, model:product})
    }
}

//define sub-class for product types Clothing
class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing){
            throw new BadRequestError('Create new Clothing error')
        }
        const newProduct =  await super.createProduct(newClothing._id)
        if(!newProduct){
            throw new BadRequestError('Create new Product error')
        }
        return newProduct;
    }

    async updateProduct (productId){
        /*
        Loc gia tri undefine va null
        Remove atribute has value Null and undifine

        Check xem update o dau
        */
        const objectParams = removeUndefineObject(this)
        if(objectParams.product_attributes){
            //update child
            await updateProductbyId({
                productId,
                bodyUpdate : updateNestedObjectParser(objectParams.product),
                model:clothing})
        }

        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct

    }
}

class Electronics extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic){
            throw new BadRequestError('Create new Electronic error')
        }
        const newProduct =  await super.createProduct(newElectronic._id)
        if(!newProduct){
            throw new BadRequestError('Create new Product error')
        }
        return newProduct;
    }
}

class Furniture extends Product{
    async createProduct(){
        const newFurnniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurnniture){
            throw new BadRequestError('Create new Furniture error')
        }
        const newProduct =  await super.createProduct(newFurnniture._id)
        if(!newProduct){
            throw new BadRequestError('Create new Product error')
        }
        return newProduct;
    }
}

module.exports = {
    ProductFactory
}

