'use strict'
const cloudinary = require('cloudinary').v2

//return 'https' URLs by setting secure: true
cloudinary.config({
    cloud_name: 'chientran',
    api_key:'12345678',
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

module.exports = {cloudinary}