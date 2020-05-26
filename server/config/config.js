process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost/coffe';
}else{
    urlDB = 'mongodb+srv://raulsulca:mongo123@cluster0-r9u1m.mongodb.net/coffe?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;