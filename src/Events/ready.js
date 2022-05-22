const Event = require('../Structures/EventBase');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			once: true,
		});
	}
	async run() {
		await this.client.utils.loadInteractions();
		console.log('\x1b[32m[BOOT] \x1b[0mReceived "ready" event.');
		this.client.editStatus('online', { name: 'PLEASE HELP ME IM KIDNAPPED IN FACE\'S BASEMENT', type: 1 });
	}
};
