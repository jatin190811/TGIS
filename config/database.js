const config = require('./config.json');
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb+srv://${config.database.username}:${config.database.password}@${config.database.host}/${config.database.db}`;


const client = new MongoClient(url);



module.exports = client ;