'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Room request Schema
 */
var RoomRequestSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Room request name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('RoomRequest', RoomRequestSchema);