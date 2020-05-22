require('./config/config');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
 
 // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json('Hello World')
})

app.get('/user', function (req, res) {
    res.json('get Server')
})

app.post('/user', function (req, res) {
    let data = req.body;
    res.json(data)
})

app.put('/user/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
})

app.delete('/user', function (req, res) {
    res.json('delete Server')
})

app.listen(process.env.PORT, () => {
    console.log(`Started in port ${process.env.PORT}`);
})