'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Allotment Schema
 */
var AllotmentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Allotment name',
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

mongoose.model('Allotment', AllotmentSchema);