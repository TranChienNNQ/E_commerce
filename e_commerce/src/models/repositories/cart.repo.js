'use strict'

const { convertObjectIdMongo } = require("../../utils")

const findByCartId = async (cartId) => {
    return await cart.findOne({_id: convertObjectIdMongo(cartId), cart_state: 'active'}).lean()
}

module.exports = {findByCartId}