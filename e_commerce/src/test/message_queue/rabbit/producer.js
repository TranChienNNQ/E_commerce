const amqp = require('amqplib')
const message = 'hello, rabbitmq for Tipjs JS'

const runProducer = async() =>{
    try{
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName,{
            durable: true //Tính bền bỉ của tin nhắn
        })
        //send message to consumer channel
        channel.sendToQueue(queueName, Buffer.from(message))

    }catch(error){
        console.error(error)
    }
}

runProducer().catch(console.error)