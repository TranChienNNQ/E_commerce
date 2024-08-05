'use strict'

const asyncHandler = () =>{
    return(req, res, next) =>{
        fn(req, res, next).catch(next)
    }
}

module.exports ={asyncHandler}