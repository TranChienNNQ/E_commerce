'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { format } = require("path")
const { getInfoData } = require("../utils")
const { findByEmail } = require("./shop.service")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.respone")

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService{
    static handlerRefreshTokenV2 = async({user,keyStore,refreshToken}) => {

        const{userId, email} = user
        if(keyStore.refreshTonkensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend !! Pls check again')
        }

        if(keyStore.refreshTonkensUsed !== refreshToken){
            throw new AuthFailureError('Shop not registeted')
        }
        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new AuthFailureError('Shop not registeted')
        }
        // create new token pair
        const tokens = await createTokenPair({userId:newShop._id, email},keyStore.publicKey, keyStore.privateKey)
        
        //update Token
        await holderToken.update({
            $set: {
                refreshToken: token.refreshToken
            }, 
            $addToSet: {
                refreshTkensUsed: refreshToken //da duoc su dung de lay token moi
            }
        })

        return{
            user,
            tokens
        }
    }

    static handlerRefreshToken = async (refreshToken)=>{

        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if(foundToken){
            //decode xem thang nay la thang nao
            const{userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({userId, email})
            //xoa
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Some wrong happen !! Please relogin')
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken){
            throw new AuthFailureError('Shop not resgisteted')
        }
        //verifyToken
        const{userId, email}= await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]--', {userId, email})
        // check userID
        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new AuthFailureError('Shop not registeted')
        }
        // create new token pair
        const tokens = await createTokenPair({userId:newShop._id, email},holderToken.publicKey, holderToken.privateKey)
        
        //update Token
        await holderToken.update({
            $set: {
                refreshToken: token.refreshToken
            }, 
            $addToSet: {
                refreshTkensUsed: refreshToken //da duoc su dung de lay token moi
            }
        })

        return{
            user: {userId, email},
            tokens
        }

    }
    /*
       check this token used?
    */ 

    /*
    B1 Check email
    B2 match password
    b3 create AT vs RT and save
    B4 generate tokens
    b5 get date return login
    */
    static logout = async(keyStore) => {
        return delKey = await KeyTokenService.removeKeyById(keyStore._id)
    }
    static login = async({email, password, refreshToken = null}) => {
        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new BadRequestError('Shop not registered')
        } //B1
        const match = bcrypt.compare(password, foundShop.password)
        if(!match){
            throw new AuthFailureError('Authentication Error')
        } //B2

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const {_id: userId} = foundShop
        const tokens = await createTokenPair({userId, email},publicKey, privateKey) //=> return AT and RF, {userId, email} is payload

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, 
            publicKey, 
            userId
        }) //find one filter userID and update model keytoken.Model 
        return{
           
                shop: getInfoData({fileds:['_id', 'name', 'email'], object: foundShop}),
                tokens
        }

    }
    static signUp = async({name, email, password}) => {
        try{
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop){
                return{
                    code: 'xxxx',
                    message: 'Shop already registered!'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password:passwordHash, roles:[roleShop.SHOP]
            })

            if(newShop){
                // create privateKey and publishKey
                // const{privateKey, publicKey} = crypto.generateKeyPairSync('rsa',{
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })

                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')
                console.log({privateKey, publicKey}) //save collection KeyStore
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey,
                    privateKey
                })
                if(!keyStore){
                    return{
                        code:'xxxx',
                        message: 'keyStore error'
                    }
                }

                // const publicKeyObject = crypto.createPublicKey(publicKeyString)

                //create token pair
                const tokens = await createTokenPair({userId:newShop._id, email},publicKey, privateKey)
                console.log(`Create Token Success::`, tokens)

                return{
                    code: 201,
                    metadata:{
                        shop: getInfoData({fileds:['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code: '200',
                metadata: null
            }
        }catch(error){
            return {
                code: 'xxx',
                message: error.message,
                status: error
            }
        }
    }
}


module.exports = new AccessService()