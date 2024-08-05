'use strict'

const {Schema, model, default: mongoose} = require('mongoose')
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

var keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    publicKey:{
        type: String,
        require: true,
    },
    privateKey:{
        type: String,
        require: true,
    },
    refreshTokensUsed:{
        type: Array,
        default: []
    }, //Nhung RF da su dung
    refreshToken:{
        type: String,
        required: true
    }
},{
   collection: COLLECTION_NAME,
   timestamps: true 
})

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema )

