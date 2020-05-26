const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

const { modelSchema: User } = require('../models/User');

app.get('/', (req, res) => {
    res.json('Hello World GAAAAAAAAAAA')
})

app.get('/user', function (req, res) {
    User.find({ state: true }, 'name email state', (err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        User.count({ state: true }, (err, count) => {
            return res.json({
                ok: true,
                user: data,
                length: count
            })
        })


    }).limit(7)  //.skip(desde)
})

app.post('/user', function (req, res) {
    let data = req.body;
    let user = new User({
        ...data
    })
    if (user.password) {
        user.password = bcrypt.hashSync(user.password, 10)
    }
    user.save((err, data) => {
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
    });
    // user.save().then(data => res.json({
    //     ok: true,
    //     user: data
    // })).catch(err => res.json({
    //     ok: false,
    //     err
    // }));
})

app.put('/user/:id', function (req, res) {
    let id = req.params.id;
    let data = req.body;

    delete data.password;
    delete data.google;
    delete data.email;
    //You can use underscore for pick only that you need anf for many data

    User.findByIdAndUpdate(id, data, { new: true, runValidators: true }, (err, data) => {
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

app.delete('/user/:email', function (req, res) {
    let email = req.params.email;
    User.findOneAndUpdate({ email }, { state: false }, { new: true }, (err, data) => {
        if (!data) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            })
        }
        return res.json({
            ok: true,
            user: data
        })
    })




    // User.findOneAndDelete({ email }, (err, data) => {
    //     if (!data) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'User not found'
    //             }
    //         })
    //     }
    //     return res.json({
    //         ok: true,
    //         user: data
    //     })
    // })
})

module.exports = app;
