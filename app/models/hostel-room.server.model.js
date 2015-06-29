'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Hostel room Schema
 */
var HostelRoomSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Hostel room name',
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

mongoose.model('HostelRoom', HostelRoomSchema);