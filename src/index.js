require('dotenv').config();

const Bot = require('./Structures/Bot');

const client = new Bot();

client.connect();