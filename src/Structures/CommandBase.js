module.exports = class Interaction {
	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.description = options.description || 'No description.';
		this.options = options.options || [];
	}
	async run() {
		throw new Error(`Interaction ${this.name} doesn't provide a run method`);
	}
};