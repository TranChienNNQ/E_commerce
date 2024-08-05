'use strict'
const mongoose = require('mongoose')
const os = require('os')
const process = require('process')

const _SECONDS = 5000

const countConnect = () => {
    const numConnection = mongoose.connect.length
    console.log(`number of connections :${numConnection}`)
}


//checkOverLoad
const checkOverLoad = () => {
    setInterval(()=>{
        const numConnection = mongoose.connections.length
        const numCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        //Example maxium number of connection bash on number of core is 5
        const maxConnections = numCore * 5;
        console.log(`Active connections:${numConnection}`)
        console.log(`Memory usage:${memoryUsage / 1024/1024} MB`)
        if(numConnection > maxConnections){
            console.log(`Connection overload detected!`)
            //notify.send(....)
        }

    },_SECONDS) //Monitor every 5s
}
module.exports = {
    countConnect,
    checkOverLoad
}
