'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Fee Schema
 */
var FeeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Fee name',
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

mongoose.model('Fee', FeeSchema);