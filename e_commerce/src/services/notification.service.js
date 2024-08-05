'use strict'

const { noti } = require("../models/notification.model")

const pushNotitoSystem = async({
    type ='SHOP-001',
    receivedId= 1,
    senderId = 1,
    options ={}

})=>{
    let noti_content
    if(type === 'SHOP-001'){
        noti_content = `@@@@ vừa mới thêm 1 sản phẩm`
    }else if('PROMOTION-001'){
        noti_content = `@@@ vua moi them 1 vouchet`
    }
    const newNoti = await noti.create({
        noti_type: type,
        noti_content: content,
        noti_sender: senderId,
        noti_receivedId: receivedId,
        noti_options: options
    })

    return newNoti
}

const listNotiByUser = async({
    userId = 1,
    type= ALL,
    isRead = 0
})=>{
    const match = {noti_receivedId: userId}
    if(type !== ALL){
        match['noti_type'] = type
    }
    return await NOTI.aggregate([
        {$match:match},
        {$project:{
            noti_type:1,
            noti_senderId: 1,
            noti_receivedId:1,
            noti_content:{
                $concat:[
                    {$substr: ['$noti_options.shope_name', 0, -1]},
                    'vua them 1 san pham moi',
                    {$substr: ['$noti_options.product_name', 0, -1]}
                ]
            },
            createAt:1,
            noti_options:1
        }}
    ])
}
module.exports = {
    pushNotitoSystem,
    listNotiByUser
}