/* eslint-disable no-unused-vars */
const database = require('mongoose');
const User = require('../Schemas/Users');
const Bot = require('../Schemas/Bot');
const config = require('./BotConfig');

module.exports = class AcoliumDatabase {
	async loadDatabase() {

		database.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: false,
			connectTimeoutMS: 30000,
			family: 4,
		});

		database.connection.on('connected', () => {
			console.log('\x1b[32m[BOOT] \x1b[0mConnected to MongoDB!');
		});

		database.connection.on('err', (err) => {
			console.minor(`Unable to connect to the MongoDB: ${err}`);
		});

		database.connection.on('disconnected', () => {
			console.small('MongoDB connection is disconnected.');
		});
	}
};
