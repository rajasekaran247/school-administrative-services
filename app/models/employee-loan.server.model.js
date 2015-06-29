'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Employee loan Schema
 */
var EmployeeLoanSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Employee loan name',
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

mongoose.model('EmployeeLoan', EmployeeLoanSchema);