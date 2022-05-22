const { Schema, model } = require('mongoose');
const Users = new Schema({
	ID: { type: String, default: 'Bot DB' },
	Transactions: { type: Array, default: [] },
	/**
     * @example Date
     * @example User1
     * @example User2
     * @example Amount
     * @example ServerID
     */
	Servers: { type: Array, default: [] },
	/**
     * @example id
     * @example name
     */
	//
	Lottery: { type: Array, default: [] },
	/**
      * @example [] ids of users.
     */
	Airdrops: { type: Array, default: [] },
	/**
       * @example id
       * @example time
       * @example amount
       * @example author
       * @example users
     */
});
module.exports = model('Bot', Users);