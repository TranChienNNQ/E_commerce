'use strict'

const { SuccessRespone } = require("../core/success.respone")
const { listNotiByUser } = require("../services/notification.service")

class NotificationController{
    listNotiByUser = async(req, res, next)=> {
        new SuccessRespone({
            message: 'create new noti success',
            metadata: await listNotiByUser(req.query)
        }).send(res)
    }
}

module.exports = new NotificationController