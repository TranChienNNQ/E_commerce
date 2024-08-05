'use strict'

const mongoose = require('mongoose')

const connectString = 'monogdb://localhost:27017/shopDev'

const testSchema = new mongoose.Schema({name: String})
const test = mongoose.model('test', testSchema)

describe('Mongoose Connection', ()=>{
    let connection;
    
    beforeAll(async()=>{
        connection = await mongoose.connect(connectString)
    })

    afterAll(async()=>{
        await connection.close()
    })

    it('should conncet to mongoose',()=>{
        expect(mongoose.connection.readyState).toBe(1)
    })

    it('should save a document to the database',async ()=>{
        const user = new test({name: 'chientran'})
        await user.save()
        expect(user.isNew).toBe(false)
    })

    it('should find  a document to the database',async ()=>{
        const user = await test.findOne({name: 'chientran'})
        expect(user).tobeDefined()
        expect(user.name).toBe('chientran')
    })
})

