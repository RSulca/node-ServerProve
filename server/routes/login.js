const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let googleUSER = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            err
        })
    });

    User.findOne({ email: googleUSER.email }, (err, userFind) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (userFind) {
            if (userFind.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: 'Please login with your license'
                })
            } else {
                let token = jwt.sign({ user: userFind }, process.env.SEED, { expiresIn: process.env.END_TOKEN });
                return res.json({
                    ok: true,
                    user: userFind,
                    token
                })
            }
        }else{
            let user = new User();
            user.name = googleUSER.name;
            user.email = googleUSER.email;
            user.password = ':|';
            user.img = googleUSER.img || "...";
            user.google = true;
            user.save((err, data)=>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                let token = jwt.sign({ user: data }, process.env.SEED, { expiresIn: process.env.END_TOKEN });
                return res.json({
                    ok: true,
                    user: data,
                    token
                })
            })
        }
    })



    // res.json({
    //     user: googleUSER
    // })
})

module.exports = app;
