'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Payroll Schema
 */
var PayrollSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Payroll name',
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

mongoose.model('Payroll', PayrollSchema);