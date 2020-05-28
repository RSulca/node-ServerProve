const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { modelSchema: User } = require('../models/User');

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!data) {
            return res.status(400).json({
                ok: false,
                message: 'The (email) or password is wrong'
            })
        }

        if (!bcrypt.compareSync(body.password, data.password)) {
            return res.status(400).json({
                ok: false,
                message: 'The email or (password) is wrong'
            })
        }

        let data2 = {
            ...data._doc
        }
        delete data2.password;

        let token = jwt.sign({ user: data2 }, process.env.SEED, { expiresIn: process.env.END_TOKEN });

        res.json({
            ok: true,
            user: data2,
            token
        })

    })





})

module.exports = app;
