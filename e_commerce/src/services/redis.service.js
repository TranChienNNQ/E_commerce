// 'use strict'

// const redis = require('redis')
// const {promisify} = require('util')
// const { reservationInventory } = require('../models/repositories/inventory.repo')
// const redisClient = redis.createClient()

// const pexpire = promisify(redisClient.pexpire).bind(redisClient)
// const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

// const acquiredLock = async (productId, quantity, cartId) =>{
//     const key = `lock_v2023_${productId}`
//     const retryTimes  =10
//     const expireTime = 3000; //3s tam lock
    
//     for(let index = 0; index < retryTimes.length; i++){
//         //tao mot key, ai cam key thi duoc quyen vao thanh toan
//         const result = await setnxAsync(key, expireTime)
//         console.log(`result:::`, result)
//         if(result === 1 ){
//             //thao tac voi inventory
//             const isReservation = await reservationInventory({
//                 productId, quantity, cartId
//             })
//             if(isReservation.modifiedCount){
//                 await pexpire(key, expiretime)
//                 return key
//             }
//             return null
//         }else{
//             await new Promise((resolve)=> setTimeout(resolve, 50))
//         }
    
//     }
// }

// const releaseLock = async keyLock => {
//     const delAsunckey = promisify(redisClient.del).bind(redisClient)
//     return await delAsunckey(keyLock)
// }

// module.exports = {
//     acquiredLock,
//     releaseLock
// }
'use strict'

const Redis = require('ioredis');
const { reservationInventory } = require('../models/repositories/inventory.repo');

const redisClient = new Redis();

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

const acquiredLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3 seconds temporary lock
  
  for (let i = 0; i < retryTimes; i++) {
    // Create a key, whoever holds the key gets the right to proceed with payment
    const result = await redisClient.setnx(key, expireTime);
    console.log(`result:::`, result);
    if (result === 1) {
      // Perform operations with inventory
      const isReservation = await reservationInventory({ productId, quantity, cartId });
      if (isReservation.modifiedCount) {
        await redisClient.pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  return null;
};

const releaseLock = async (keyLock) => {
  return await redisClient.del(keyLock);
};

module.exports = {
  acquiredLock,
  releaseLock
};
