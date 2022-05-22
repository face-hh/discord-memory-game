const { Schema, model } = require('mongoose');
const Guilds = new Schema({
	GuildId: { type: String, required: true },

	CreatedAt: { type: Date, default: Date.now() },

	DM: { type: Boolean, default: true },
	ShowBonus: { type: Boolean, default: true },

	MessageBonus1: { type: String, default: 'Congrats on giving your first :icecream: <@{user.id}>! Here\'s some bonus :icecream: so you can keep on giving!' },
	MessageBonus2: { type: String, default: 'Congrats on receiving your first :icecream: <@{user.id}>! Here\'s some extra :icecream: to add to your balance!' },
	MessageBonus3: { type: String, default: 'Congrats on sending 10 :icecream:, <@{user.id}>! Here\'s a bonus :icecream: for you!' },
	MessageDM: { type: String, default: 'You received {scoops} :icecream: Scoop(s) from <@{user.id}> ({user.tag})! Your balance is {user.Scoops} :icecream:.' },
});
module.exports = model('Guilds', Guilds);