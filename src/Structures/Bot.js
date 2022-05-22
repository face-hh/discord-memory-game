const { Client } = require('eris');
const Utils = require('./BotUtils.js');
const config = require('./BotConfig');

module.exports = class BotClient extends Client {
	constructor(options = config) {
		options.token = config.devMode === true ? process.env.TOKEN_DEV : process.env.TOKEN;

		super(options.token, { restMode: true, intents: ['allNonPrivileged', 'guildMembers'], getAllUsers: true });

		this.validate(options);

		this.interactions = new Map();
		this.devMode = true;
		this.events = new Map();
		this.utils = new Utils(this);
		this.cooldowns = new Map();
		this.config = config;
		this.data = [];
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		this.token = options.token;
		this.prefix = options.prefix;
		this.developers = options.developers;
		this.devMode = options.devmode;

	}

	async connect() {
		require('events').EventEmitter.defaultMaxListeners = 0;
		await this.utils.loadEvents();
		await this.utils.loadProperties();

		await super.connect();

		setTimeout(() => {
			console.table([{
				Events: true,
				Properties: true,
				Interactions: true,
			}]);
		}, 1000);
	}
};
