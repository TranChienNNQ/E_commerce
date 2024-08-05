'use strict'

const amqp = require('amqplib')
const message = 'new a product: title abcassd'

const runProducer = async() =>{
    const connection = await amqp.connect('amqp://guest:guest@localhost')
    const channel = await connection.createChannel()

    const notificationExchange = 'notification' // notification direct
    const notiQueque = 'notificationQueueProcess' //assertQueue
    const notificationExchangeDLX = 'notificationExDLX' //notificationEx direct
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' //assert
    //1 Create Exchange
    await channel.assertExchange(notificationExchange, 'direct',{
        durable:true
    })
    //2 Create queue
    const queueResult = await channel.assertQueue(notiQueque,{
        exclusive: false, //cho phep cac ket noi truy cap vao cung mot luc hang doi
        deadLetterExchange: notificationExchangeDLX,
        deadLetterRoutingKey: notificationRoutingKeyDLX
    })
    
    // 3 bindQueue
    await channel.bindQueue(queueResult.queue, notificationExchange)
    // 4 send message
    const msg ='a new product'
    console.log(`producer msg ::`,msg)
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg),{
        expiration: '1000'
    })


}