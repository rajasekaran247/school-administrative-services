'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Leave Schema
 */
var LeaveSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Leave name',
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

mongoose.model('Leave', LeaveSchema);