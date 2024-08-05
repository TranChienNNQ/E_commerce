'use strict'

const { filter, update } = require("lodash")
const keytokenModel = require("../models/keytoken.model")
const {Types} = require('mongoose')
const { options } = require("../routes")
const { privateEncrypt } = require("crypto")

class KeyTokenService{
    static createKeyToken = async({userId, publicKey, privateKey, refreshToken})=>{
        try{
            // const publicKeyString = publicKey.toString()
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey, //publicKeyString
            //     privateKey
            // })
            // return tokens ? token.publicKey : null
            const filter = {user: userId}, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = {upsert: true, new: true}
            
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        }catch(error){
            return error
        }
    }

    static findByUserId = async(userId) => {
        return await keytokenModel.findOne({user: Types.ObjectId(userId)}).lean()
    }

    static removeKeyById = async(id)=>{
        return await keytokenModel.remove(id)
    }

    static findByRefreshTokenUsed = async(refreshToken) =>{
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken})
    }

    static deleteKeyById = async(userId) => {
        return await keytokenModel.deleteOne({user: Types.ObjectId(userId)})
    }    
    static findByRefreshToken = async(refreshToken) =>{
        return await keytokenModel.findOne({refreshToken})
    }

    }

module.exports = KeyTokenService