const { Client } = require('pg');
require('dotenv').config();

const{
    USER,
    HOST,
    DATABASE,
    PASSWORD,
    PORT
} = process.env

const db = new Client({
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT,
});

module.exports = db;