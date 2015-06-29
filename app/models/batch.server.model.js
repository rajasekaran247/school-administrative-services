'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Batch Schema
 */
var BatchSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Batch name',
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

mongoose.model('Batch', BatchSchema);