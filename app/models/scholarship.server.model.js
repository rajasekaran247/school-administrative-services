'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Scholarship Schema
 */
var ScholarshipSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Scholarship name',
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

mongoose.model('Scholarship', ScholarshipSchema);