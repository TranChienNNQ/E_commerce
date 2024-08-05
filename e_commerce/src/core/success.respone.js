'use strict'

const { model } = require("mongoose")

const StatusCode = {
    OK: 200,
    CREATE: 201
}

const ResponeStatusCode ={
    OK : 'Success',
    CREATE: 'Created'

}
class SuccessRespone {
    constructor(message, statusCode = StatusCode.OK, responeStatusCode = ResponeStatusCode.OK, metadata = {}){
        this.message = !message ? responeStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers= {}){
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessRespone{
    constructor({message, metadata}){
        super({message, metadata})
    }
}

class CREATE extends SuccessRespone{
    constructor({options={}, message, statusCode=StatusCode.CREATE, responeStatusCode= ResponeStatusCode.CREATE, metadata}){
        super({message, statusCode, responeStatusCode, metadata})
        this.options = options
    }
}

module.exports = {
    OK,
    CREATE,
    SuccessRespone
}