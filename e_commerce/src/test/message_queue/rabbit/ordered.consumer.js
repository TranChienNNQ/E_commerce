'use strict'
const amqp = require('amqplib')
async function consumerOrderedMessage(){
    const connection = await amqp.connect('amqp://guest:guest:@loaclhost')
    const channel = connection.createChannel()

    const queueName = 'order-queue-message'
    await channel.assertQueue(queueName, {
        durable: true
    }) 
    //set prefetch to 1 to ensure only one ack at a time
    // highlight this code
    channel.prefetch(1)
    //////////////////////////////

    await channel.consume(queueName, msg =>{
        const message = msg.content.toString()

    
    setTimeout(()=>{
        console.log(`'processed:`, message)
        channel.ack(msg)
    }, Math.random()*1000)
})
}
 consumerOrderedMessage().catch(err => console.error(error))