//Enviroment PORT
require('./config/config')

//Configuraciones iniciales  
const express = require('express')
const app = express()
const path = require('path')


//Configuracion bd
require('./bd/connection')

//Da cuerpo en los request
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Querys
app.use(require('./routes/index'));

//Use a public file
app.use(express.static(path.resolve(__dirname, '../public')));


app.listen(process.env.PORT, () => {
    console.log(`Started in port ${process.env.PORT}`);
})