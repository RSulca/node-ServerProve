//PORT
process.env.PORT = process.env.PORT || 3000;

//HEROKU VARIABLE
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//CADUCIDAD TOKEN
process.env.END_TOKEN = 60 * 60 * 24 * 60;

//SEED PROJECT
process.env.SEED = process.env.SEED || 'seed-project';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost/coffe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;