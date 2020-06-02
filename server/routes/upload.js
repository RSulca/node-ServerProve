const express = require('express')
const fileUpload = require('express-fileupload')
const app = express();

const { modelSchema: User } = require('../models/User');
const { modelSchema: Product } = require('../models/Product');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:type/:id', function (req, res) {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        })
    }

    let kind = ['jpg', 'png', 'gif', 'jpeg'];

    let file = req.files.file;
    let names = file.name.split('.');

    let types = ['users', 'products'];

    if (types.indexOf(req.params.type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Wrong type'
            }
        })
    }

    if (kind.indexOf(names[names.length - 1]) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Format not allowed.'
            }
        })
    }

    let fileName = `${req.params.id}-${new Date().getMilliseconds()}.${names[names.length - 1]}`;

    file.mv(`uploads/${req.params.type}/${fileName}`, function (err) {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'No files were uploaded.'
            });

        //Ready
        if (req.params.type === 'users') {
            imageUser(req.params.id, res, fileName);
        }else{
            imageProduct(req.params.id, res, fileName);
        }

        // res.json({
        //     ok: true,
        //     message: 'File uploaded!'
        // });
    });
});

function imageUser(id, res, fileName) {

    User.findById(id, (err, data) => {
        if (err) {
            deleteImg(fileName, 'users')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!data) {
            deleteImg(fileName, 'users')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not exist'
                }
            })
        }

        ///////////////
        deleteImg(data.img, 'users');
        ///////////////

        data.img = fileName;
        data.save((err, data) => {
            res.json({
                ok: true,
                data
            })
        })
    })
}

function imageProduct(id, res, fileName, type) {
    Product.findById(id, (err, data) => {
        if (err) {
            deleteImg(fileName, 'products')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!data) {
            deleteImg(fileName, 'products')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not exist'
                }
            })
        }

        ///////////////
        deleteImg(data.img, 'products');
        ///////////////

        data.img = fileName;
        data.save((err, data) => {
            res.json({
                ok: true,
                data
            })
        })
    })
}

function deleteImg(fileName, type) {
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }
}


module.exports = app;
