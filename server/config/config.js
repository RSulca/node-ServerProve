//PORT
process.env.PORT = process.env.PORT || 3000;

//HEROKU VARIABLE
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//CADUCIDAD TOKEN
process.env.END_TOKEN = '24h';

//SEED PROJECT
process.env.SEED = process.env.SEED || 'seed-project';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost/coffe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//CLIENT ID
process.env.CLIENT_ID = process.env.CLIENT_ID || "930256584559-saqjihob312aqst2e4d072mpdt16j0nv.apps.googleusercontent.com";