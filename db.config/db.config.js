const { Client } = require('pg');
require('dotenv').config();

const{
    USER,
    HOST,
    DATABASE,
    PASSWORD,
    PORT_DB
} = process.env

const db = new Client({
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT_DB,
});

module.exports = db;