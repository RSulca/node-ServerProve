const express = require('express')
const app = express();

const { modelSchema: User } = require('../models/User');
const { modelSchema: Product } = require('../models/Product');

const { urlTokenImg } = require('../middleware/authorization')

const fs = require('fs');
const path = require('path');

app.get('/image/:type/:img', urlTokenImg ,(req, res) => {

    let type = req.params.type;
    let img = req.params.img;

    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath)
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/img/no-image.jpg');
        res.sendFile(noImagePath)
    }



})


module.exports = app;
