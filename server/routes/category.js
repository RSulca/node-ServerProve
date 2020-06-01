const express = require('express')
const app = express()

const { modelSchema: Category } = require('../models/Category')
const { verification, license } = require('../middleware/authorization')

app.get('/category', verification, (req, res) => {
    Category.find()
        .sort('description')
        .populate('user', 'name email')
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Category.count((err, count) => {
                return res.json({
                    ok: true,
                    user: data,
                    length: count
                })
            })

        })
})

app.get('/category/:id', verification, (req, res) => {
    let id = req.params.id;
    Category.findById(id)
        .populate('user', 'name email')
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

app.post('/category', verification, (req, res) => {
    let category = new Category({
        description: req.body.description,
        user: req.user._id
    })

    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.json({
            ok: true,
            category
        })
    });
})

app.put('/category/:id', verification, (req, res) => {
    let id = req.params.id;
    Category.findByIdAndUpdate(id, { description: req.body.description }, { new: true, runValidators: true }, (err, data) => {
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

app.delete('/category/:id', [verification, license], (req, res) => {
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!data) {
            return res.status(400).json({
                ok: false,
                err: 'Not exist this category.'
            })
        }
        return res.json({
            ok: true,
            user: data
        })
    })
})

module.exports = app;
