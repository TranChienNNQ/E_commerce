'use strict'
const amqp = require('amqplib')
async function consumerOrderedMessage(){
    const connection = await amqp.connect('amqp://guest:guest:@loaclhost')
    const channel = connection.createChannel()

    const queueName = 'order-queue-message'
    await channel.assertQueue(queueName, {
        durable: true
    })
    for (let i = 0; i<10; i++){
        const message = `ordered queue message :: ${i}`
        console.log(`message: ${message}`)
        await channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        })
    }

    setTimeout(()=>{
        connection.close()
    }, 1000)
}

module.exports = {
    consumerOrderedMessage
}