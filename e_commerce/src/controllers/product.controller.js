'use strict'

const { SuccessRespone } = require("../core/success.respone")
const { product } = require("../models/product.model")
const {ProductFactory} = require("../services/product.service")

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessRespone({
            message: 'Create new Product Success',
            metadate: await ProductFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }


    //update
    updateProduct = async (req, res, next) => {
        new SuccessRespone({
            message: 'Updata Product Success',
            metadata: await ProductFactory.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    
    publishProductByShop = async(req, res, next) => {
        new SuccessRespone({
            message: 'publishProductByShop Success',
            metadata: await ProductFactory.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProductByShop = async(req, res, next) => {
        new SuccessRespone({
            message: 'unPublishProductByShop Success',
            metadata: await ProductFactory.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

           //Query
        getAllDraftsForShop = async(req, res, next) => {
        new SuccessRespone({
            message: "Create new Product success",
            metadata: await ProductFactory.findAllDraftsForShop({
                product_shop: req.user.userId
                })
        }).send(res)
        }
        getAllPublishForShop = async(req, res, next) => {
            new SuccessRespone({
                message: "Create new Product success",
                metadata: await ProductFactory.findAllPublishForShop({
                    product_shop: req.user.userId
                    })
            }).send(res)
            }

            getListSearchProduct= async(req, res, next) => {
                new SuccessRespone({
                    message: "Get ListSearchProduct success",
                    metadata: await ProductFactory.searchProduct(req.params)
                }).send(res)
                }


            findAllProducts= async(req, res, next) => {
                new SuccessRespone({
                    message: "Get List findAllProducts success",
                    metadata: await ProductFactory.findAllProducts(req.query)
                }).send(res)
                }
        
            findProduct= async(req, res, next) => {
                new SuccessRespone({
                    message: "Get List findProduct success",
                    metadata: await ProductFactory.findProduct({
                        product_id: req.params.product_id
                    })
                    }).send(res)
                }
        //End query


}

module.exports = new ProductController()