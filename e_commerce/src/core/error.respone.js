'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ResponeStatusCode ={
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error'
}

const { StatusCodes, ReasonPharses} = require("../utils/httpStatusCode")

class Errorrespone extends Error{
    constructor(message, status){
        super(message)
        this.status = status
    }
}

class ConflictResquestError extends Errorrespone{
    constructor(message = ResponeStatusCode.CONFLICT, statusCode= StatusCode.FORBIDDEN){
        super(message, statusCode)
    }
}

class BadRequestError extends Errorrespone{
    constructor(message = ResponeStatusCode.CONFLICT, statusCode= StatusCode.FORBIDDEN){
        super(message, statusCode)
    }
}

class AuthFailureError extends Errorrespone{
    constructor(message= ReasonPharses.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED){
        super(message, statusCode)
    }
}

class NotFoundError extends Errorrespone{
    constructor(message= ReasonPharses.NOT_FOUND, statusCode = StatusCode.NOT_FOUND){
        super(message, statusCode)
    }
}


class ForbiddenError extends Errorrespone{
    constructor(message= ReasonPharses.FORBIDDEN, statusCode = StatusCode.FORBIDDEN){
        super(message, statusCode)
    }
}

module.exports = {
    ConflictResquestError,
    BadRequestError,
    AuthFailureError, 
    NotFoundError, 
    ForbiddenError
}