'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Hostel room request Schema
 */
var HostelRoomRequestSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Hostel room request name',
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

mongoose.model('HostelRoomRequest', HostelRoomRequestSchema);