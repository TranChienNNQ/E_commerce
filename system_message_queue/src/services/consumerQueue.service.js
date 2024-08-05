'use strict'

const { result } = require("lodash")
const { consumerQueue, connectToRabbitMQ } = require("../dbs/init.rabbit")

const messageService = {
    consumerQueue: async(queueName)=>{
        try{
            const {channel, connection} = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        }catch(error){
            console.error(`Error consumeerToQueue::`, error)
        }
    },

    //case processing
    consumerToQUeueNormal: async(queueName)=>{
        try{
            const {channel, connection} = await connectToRabbitMQ()
            const notiQueue = 'notificationQueueProcess' //assrtQueue

            channel.consume(notiQueue, msg =>{
                console.log(`SEND notifationQueue successfully process`, msg.content.toString())
                channel.ack(msg)
            })
        }catch(error){
            console.error(error)
        }
    },

    // consumerToQUeueNormalLogic: async(queueName)=>{
    //     try{
    //         const {channel, connection} = await connectToRabbitMQ()
    //         const notiQueue = 'notificationQueueProcess' //assrtQueue         
    //         channel.consume(notiQueue, msg =>{
    //             try{
    //                 const numberTest = Math.random()
    //                 console.log({numberTest})
    //                 if(numberTest<0.8){
    //                     throw new Error(`Send notification failed:HOT FIX`)
    //                 }
    //                 console.log(`SEND notificationQUeue succeddfully processed:`, msg.content.toString())
    //                 channel.ack(msg)
    //             }catch(error){
    //                 console.error(`SEND notification error:`, error)
    //                 channel.nack(msg, false, false)
    //             }
    //             /**
    //              nack: negative acknownledgement
    //              */
    //         })
    //     }catch(error){
    //         console.error(error)
    //     }
    // },

    consumerToQueueFailed: async(queueName)=>{
        try{
            const {channel, connection} = await connectToRabbitMQ()
            const notificationExchangeDLX = 'notificationExDLx' // notification Direct
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
            const notiQueueHandler = 'notificationQueueHotFix'
            await channel.assertExchange(notificationExchangeDLX, 'direct',{
                durable:true
            })

            const queueResult = await channel.assertQueue(notiQueueHandler, {
                exclusive: false
            })

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
            await channel.consume(queueResult.queue, msgFailed=>{
                console.log(`this notification error: pls hotfix`, msgFailed.content.toString())
            },{
                noAck: true 
            })
        }catch(error){
            console.error(error)
            throw error
        }
    }
}

module.exports = messageService