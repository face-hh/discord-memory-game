const { Schema, model } = require('mongoose');
const Users = new Schema({
	UserId: { type: String, required: true },

	JoinedAt: { type: Date, default: Date.now() },
	ServerId: { type: String, default: 'User registered while this value wasn\'t there.' },
	LastActive: { type: Date, default: Date.now() },
	Premium: { type: Boolean, default: false },
	Votes: { type: Number, default: 0 },

	Scoops: { type: Number, default: 1 },

	FirstTimeSent: { type: Boolean, default: true },
	FirstTimeReceived: { type: Boolean, default: true },
	FirstScoops: { type: Number, default: 0 },
	LastTimeSent: { type: Array, default: [] },
	LastTimeSent2: { type: Array, default: [] },
	LifetimeSent: { type: Number, default: 0 },
	LifetimeReceived: { type: Number, default: 0 },

	AutoLottery: { type: Boolean, default: false },
	//
});
module.exports = model('Users', Users);