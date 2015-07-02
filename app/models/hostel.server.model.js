'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Hostel Schema
 */
var HostelSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Hostel name',
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

mongoose.model('Hostel', HostelSchema);