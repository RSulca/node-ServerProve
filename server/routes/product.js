const express = require('express')
const app = express()

const { modelSchema: Product } = require('../models/Product')
const { verification } = require('../middleware/authorization')

app.get('/product', verification, (req, res) => {
    Product.find()
        .sort('name')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Product.count((err, count) => {
                return res.json({
                    ok: true,
                    user: data,
                    length: count
                })
            })

        })
})

app.get('/product/:id', verification, (req, res) => {
    let id = req.params.id;
    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            return res.json({
                ok: true,
                user: data
            })
        })
})

app.get('/product/search/:term', verification, (req, res) => {

    let term = req.params.term;

    let exp = new RegExp(term, 'i')

    Product.find({name: exp})
        .sort('name')
        .populate('category', 'description')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Product.count({name: exp}, (err, count) => {
                return res.json({
                    ok: true,
                    user: data,
                    length: count
                })
            })

        })
})

app.post('/product', verification, (req, res) => {
    let product = new Product({
        ...req.body
    })
    product.user = req.user._id;
    product.save((err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.json({
            ok: true,
            product: data
        })
    });
})

app.put('/product/:id', verification, (req, res) => {
    let id = req.params.id;
    Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.json({
            ok: true,
            user: data
        })
    })
})

app.delete('/product/:id', verification, (req, res) => {
    let id = req.params.id;
    Product.findByIdAndUpdate(id, {stock: false}, { new: true, runValidators: true } ,(err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!data) {
            return res.status(400).json({
                ok: false,
                err: 'Not exist this product.'
            })
        }
        return res.json({
            ok: true,
            user: data
        })
    })
})

module.exports = app;
