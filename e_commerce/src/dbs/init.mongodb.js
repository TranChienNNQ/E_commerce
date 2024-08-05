'use strict'
const mongoose = require('mongoose')
const {countConnect} = require('../helper/check.connect')
const{db:{host, name, port}} = require('../configs/config.mongodb')

const connectString = `mongodb://${host}:${port}/${name}`

class Database {
    constructor(){ 
        this.connect()
    }
    connect(type='mongodb'){
        if(1===1){
            mongoose.set('debug', true)
            mongoose.set('debug', {color:true})
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then(_=>{
            console.log(`Connected Mongodb Success Pro`, countConnect() )
        })
        .catch(err =>console.log(`Error Connect`))
    }
//check connect exist
    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance() //init connect db

module.export = instanceMongodb