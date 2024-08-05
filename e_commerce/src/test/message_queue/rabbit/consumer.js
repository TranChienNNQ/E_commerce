const amqp = require('amqplib')

const runConsumer = async() =>{
    try{
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName,{
            durable: true //Tính bền bỉ của tin nhắn
        })
        //send message to consumer channel
        channel.consume(queueName, (message)=>{
            console.log(`Received ${message.content.toString()}`)
        },{
            noAck: true //neu da consumer da nhan message, message se bi xoa trong queue
        })

    }catch(error){
        console.error(error)
    }
}

runConsumer().catch(console.error)