'use strict'

const { error } = require('console')
const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helper/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.respone')
const { findByUserId } = require('../services/keyToken.service')
const { keys } = require('lodash')
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'athorization',
    REFRESHTOKEN: 'x-rtoken-id'
}


const createTokenPair = async(payload, publicKey, privateKey) =>{
    try{
        //accessToken
        const accessToken = await JWT.sign(payload, publicKey,{
            // algorithm:'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey,{
            // algorithm: 'RS256',
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey,(err, decode)=>{
            if(err){
                console.log(`error verify::`, err)
            }else{
                console.log(`decode verify::`, decode)
            }
        })

        return{accessToken, refreshToken}
    }catch(error){

    }
}

const authentication = asyncHandler(async(req, res, next)=>{
    /*
    check userId co missing ko?
    get access token
    verify token
    check user trong db
    check keyStore with this userId
    ok all => return next()
    */
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId){
        throw new AuthFailureError('Invalid Request')
    }

    const keyStore = await  findByUserId(userId)
    if(!keyStore){
        throw new NotFoundError('Not Found KeyStore')
    }
    //verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken){throw new AuthFailureError('Invalid Request')}

    try{
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId ){
            throw new AuthFailureError('Invalid UserId')
        }
        req.keyStore = keyStore
        return next()
    }catch(error){
        throw error
    }

})

const authenticationV2 = asyncHandler(async(req, res, next)=>{
    /*
    check userId co missing ko?
    get access token
    verify token
    check user trong db
    check keyStore with this userId
    ok all => return next()
    */
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId){
        throw new AuthFailureError('Invalid Request')
    }

    const keyStore = await  findByUserId(userId)
    if(!keyStore){
        throw new NotFoundError('Not Found KeyStore')
    }
    if(req.headers[HEADER.REFRESHTOKEN]){
        try{
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if(userId === decodeUser.userId){
                throw new AuthFailureError('Invalid UserId')
                req.keyStore = keyStore
                req.user = decodeUser
                req.refreshToken = refreshToken
                return next()
            }
        }catch(error){
            throw error
        }
    }
    //verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) {throw new AuthFailureError('Invalid Request')}

    try{
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId ){
            throw new AuthFailureError('Invalid UserId')
        }
        req.keyStore = keyStore
        return next()
    }catch(error){
        throw error
    }

})

const verifyJWT = async(token, keySecret) =>{
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication, 
    verifyJWT, 
    authenticationV2
}