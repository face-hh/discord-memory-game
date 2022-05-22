const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const fetch = require('node-fetch');

module.exports = class Utilities {
	constructor(client) {
		this.client = client;
	}
	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	async loadInteractions() {
		const interactions = await glob(`${this.directory}/Commands/**/*.js`);

		for (const interactionFile of interactions) {
			delete require.cache[interactionFile];
			const { name } = path.parse(interactionFile);
			const File = require(interactionFile);
			const interaction = new File(this.client, name.toLowerCase());

			this.client.interactions.set(interaction.name, interaction);
			this.client.cooldowns.set(interaction.name, new Map());

			this.client.createCommand(interaction);
		}
	}

	async loadEvents() {
		const events = await glob(`${this.directory}/Events/*.js`);
		for (const eventFile of events) {
			delete require.cache[eventFile];
			const { name } = path.parse(eventFile);
			const File = require(eventFile);
			const event = new File(this.client, name);

			this.client.events.set(event.name, event);
			event.emitter[event.type](name, (...args) => event.run(...args));

		}
	}

	async loadProperties() {
		const properties = require('../Custom/properties');

		properties;
	}

	async loadDBL() {
		const Webhook = require('./BotDBLCore');
		const webhook = new Webhook(process.env.TOPGG_PASS);

		webhook.login('/votesOnTopGG', 21369);
		webhook.on('vote', async (x) => {
			const data = await this.client.db.findUser(x.user);
			const coins = x.isWeekend === true ? 10 : 5;
			const votes = x.isWeekend === true ? 2 : 1;
			const user = await this.client.users.get(x.user);

			data.Scoops += coins;
			data.Votes += votes;
			data.save();

			this.client.createMessage((await this.client.getDMChannel(x.user))?.id,
				`Thanks for voting for me on top.gg! Here, take **${this.client.scoop} ${coins}**!${x.isWeekend === true ? ' Double rewards since it\'s weekend!' : ''}`,
			).catch(() => {});

			await fetch('https://discord.com/api/webhooks/959830316741173248/KKdO_AoECshpOzFhRFDcNn6tRbBlCVNE9pjWklklLb_v2ZHPyl9M2Fi790aAQs0GZbbX',
				{
					method: 'POST',
					body: JSON.stringify({ content: `**${user.username}** just voted for me, they are now at \`${data.Votes}\` votes!` }),
					headers: {
						'Content-Type': 'application/json',
					},
				});
		});
	}

	/**
	 * @param {object} options - The options needed for the collector.
	 */
	async createInteractionCollector(options) {
		const dir = require('../Custom/interactionCollector');
		return dir.collectInteractions(options);
	}

	getOptions(name, interaction) {
		return interaction.data.options.find((x) => x.name === name);
	}

	/**
	 * @param {Number} scoops
	 * @param {Object} airdrop
	 * @param {Object} interaction
	 * @param {Time} timeFromArgs
	 * @param {Time} time
	 */
	async endAirdrop(scoops, airdrop, interaction, timeFromArgs, time, collector) {
		const map = [];
		const amount = (scoops / airdrop.users.length);
		for(let i = 0; i < airdrop.users.length; i++) {
			const x = airdrop.users[i];
			const y = interaction?.channel?.guild?.members?.get?.(x) ?? await this.client.getRESTUser(x);
			const z = await this.client.db.findUser(x, interaction);

			z.Scoops += amount;
			z.save();

			// limit 50 users to be displayed
			if(i > 49) {
				map.push(`and other ${airdrop.users.length - 49}`);
				break;
			}
			map.push(y.username);
		}

		let continue2;

		if(amount == Infinity || airdrop.users.length == 0) {
			continue2 = '| Collected by no one.';
		}
		else {
			continue2 = `| **${amount.toFixed(6)} ${this.client.scoop}** | Collected by: ${map.join(', ')}.`;
		}
		const embed = {
			color: 0x00FF00,
			title: 'This airdrop ended!',
			description: `<@${airdrop.author}> started an airdrop of **${scoops} ${this.client.scoop}** for \`${timeFromArgs}\`${continue2}`,
			footer: { text: 'Ended at' },
			timestamp: new Date(Date.now() + time).toISOString(),
			components: [],
		};

		this.client.editMessage(airdrop.cid, airdrop.id, {
			content: '\u200b',
			embed: embed,
			components: [],
		});

		collector?.stopListening?.('end');
	}

	/**
	 * @param {object} options - The options needed for the collector.
	*/
	async createMessageCollector(options) {
		const dir = require('../Custom/messageCollector');
		return dir.collectInteractions(options);
	}
};
