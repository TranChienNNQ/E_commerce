'use strict'

const { OK, CREATE, SuccessRespone } = require("../core/success.respone")
const AccessService = require("../services/access.service")

class AccessController{
    handlerRefreshToken = async (req, res, next) => {
        new SuccessRespone({
            message: 'Get token success!',
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        })
    }

    login = async(req, res, next)=> {
        new SuccessRespone({
            metadata: await AccessService.login(req.body)
        })
    }

    logout = async(req, res, next)=> {
        new SuccessRespone({
            message: 'Louout Sucess!',
            metadata: await AccessService.logout(req.keyStore)
        })
    }

    signUp = async(req, res, next) => {
        
        new CREATE({
            message: 'Regiserted OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
        
            }
        }).send(res)
        // return res.status(200).json({
        //     message: '',
        //     metadata: ''
        // })
            //console.log(`[P]::signUp::`, req.body)
            // return res.status(201).json(await AccessService.signUp(req.body))
        
    }
}

module.exports = new AccessController()