'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Grade Schema
 */
var GradeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Grade name',
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

mongoose.model('Grade', GradeSchema);