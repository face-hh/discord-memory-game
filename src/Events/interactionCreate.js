const Eris = require('eris');
const Event = require('../Structures/EventBase');

module.exports = class extends Event {

	async run(interaction) {
		if(interaction instanceof Eris.CommandInteraction) {

			if (!interaction.guildID) return;
			try {
				const command = this.client.interactions.get(interaction.data.name);
				if (!command) return;

				if(!interaction.options) return await command.run(interaction, this.client);

				await command.run(
					interaction,
					interaction.options._options.map((value) => value.value),
				);
			}
			catch (err) {
				this.client.createMessage(interaction.channel.id, { content: 'Something went wrong!' }).catch(() => {});

				/** for(error): HANDLING COMPLETE ERRORS ON DEV, CUSTOM FOR NON. */
				this.client.devMode === true ? console.error(err) : console.minor(`Error caught: ${err}`);
			}
		}

	}
};
