const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

const { modelSchema: User } = require('../models/User')
const { verification, license } = require('../middleware/authorization')


app.get('/', (req, res) => {
    res.json('Hello World GAAAAAAAAAAA')
})

app.get('/user', verification , (req, res) => {


    // return res.json({
    //     user: req.user
    // })


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
//[ verification, license] ,
app.post('/user',   (req, res)=> {
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
        let data2 = {
            ...data._doc
        }
        delete data2.password;
        return res.json({
            ok: true,
            user: data2
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

app.put('/user/:id', [ verification, license] , (req, res)=> {
    let id = req.params.id;
    let data = req.body;

    delete data.password;
    delete data.google;
    delete data.email;
    //You can use underscore for pick only that you need and for many data

    User.findByIdAndUpdate(id, data, { new: true, runValidators: true }, (err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        let data2 = {
            ...data._doc
        }
        delete data2.password;

        return res.json({
            ok: true,
            user: data2
        })
    })
})

app.delete('/user/:email', [ verification, license] , (req, res)=> {
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
