const jwt = require('jsonwebtoken')

let verification = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, data) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: err.name
            })
        }
        req.user = data.user;
        next();
    })
}

let license = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, data) => {
        if (data.user.role === 'ADMIN_ROLE') {
            req.user = data.user;
            next();
        } else {
            return res.status(401).json({
                ok: false,
                err: 'You dont have the license'
            })
        }
    })
}

module.exports = {
    verification,
    license
}