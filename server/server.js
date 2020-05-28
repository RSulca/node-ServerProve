//Enviroment PORT
require('./config/config')

//Configuraciones iniciales  
const express = require('express')
const app = express()

//Configuracion bd
require('./bd/connection')

//Da cuerpo en los request
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use( require('./routes/index'));


app.listen(process.env.PORT, () => {
    console.log(`Started in port ${process.env.PORT}`);
})