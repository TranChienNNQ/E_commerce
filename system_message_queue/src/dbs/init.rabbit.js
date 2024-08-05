'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async()=>{
    try{
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        if(!connection){
            throw new Error('Connection not established')
        }
        const channel = await connection.createChannel()
        return(channel, connection)
    }catch(error){

    }
}

const connectToRabbitMQForTest = async()=>{
    try{
        const{channel, connection} = await connectToRabbitMQ()
        const quene = 'test-queue'
        const message = 'Hello, shopDev by Chientran'
        await channel.assertQueue(quene)
        await channel.sendToQueue(quene, Buffer.from(message))
        await connetion.close()
    }catch(error){

    }
}

const consumerQueue = async(channel, queueName)=>{
    try{
        await channel.assertQueue(queueName, {durable:true})
        console.log(`Waiting for message...`)
        channel.consume(queueName, msg => {
            console.log(`Received message: ${queueName}::`, msg.content.toString())
        },{
            noAck:true
        })
    }catch(error){
        console.error(`Error publish message to RabbitMQ::`, error)
        throw error
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
    
}