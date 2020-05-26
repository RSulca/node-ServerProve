require('../config/config');
const mongoose = require('mongoose')
const db = mongoose.connection;

mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true});
db.on('open', ()=>{
    console.log('Database started in '+process.env.URLDB);
})