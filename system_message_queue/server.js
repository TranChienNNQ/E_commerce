'use strict'

const { consumerQueue, consumerToQUeueNormal, consumerToQueueFailed } = require("./src/services/consumerQueue.service")

const queueName = 'test-topic'
consumerQueue(queueName).then(()=>{
    console.log(`message consumer started ${queueName}`)
}).catch(err =>{
    console.error(`message error: ${err.messagge}`)
})

consumerToQUeueNormal(queueName).then(()=>{
    console.log(`message consumerToQueueNormal started`)
}).catch(err =>{
    console.error(`message error: ${err.messagge}`)
})

consumerToQueueFailed(queueName).then(()=>{
    console.log(`message consumerToQueueFailed started`)
}).catch(err =>{
    console.error(`message error: ${err.messagge}`)
})