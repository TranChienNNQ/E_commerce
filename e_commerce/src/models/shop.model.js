'use strict'


//!dmbg
const {model, Schema, mongoose, Types} = require('mongoose')
const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

const shopSchema = new Schema({
  name: {
    type: String,
    trim: true,
    maxLength: 150,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['avtive', 'inactive'],
    default: 'inactive'
  },
  verify: {
    type: Schema.Types.Boolean,
    default: false
  },
  roles: {
    type: Array,
    default: []
  }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);

