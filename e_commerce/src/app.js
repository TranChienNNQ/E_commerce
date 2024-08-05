const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require('morgan') 
const {default:helmet}=require('helmet')
const compression = require('compression')
const productTest = require('./test/product')



// init Middlewares
app.use(morgan("dev")) //làm màu 
// app.use(morgan("combined"))
app.use(helmet()) //bảo vệ thông tin
app.use(compression()) //giảm dung lượng payload
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

//test pub/sub
require('./test/inventory')
productTest.purchaseProduct('product:001', 10)

console.log(`Process::`,process.env)
//init db
require('./dbs/init.mongodb')
// const {countConnect} = require('./helper/check.connect')
// countConnect()
// const {checkOverLoad} = require('./helper/check.connect')
// checkOverLoad()
// app.get('/', (req, res, next) => {
//     return res.status(500).json({
//         message: 'Welcome'
//     })
// })
app.use('/',require('./routes/index'))


//handleError

app.use((req, res, next)=>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
}) // Function Middleware process

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status : 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server error'

    })
}) //Handle Error

module.exports = app