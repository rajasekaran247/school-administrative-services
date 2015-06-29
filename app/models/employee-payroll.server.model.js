'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Employee payroll Schema
 */
var EmployeePayrollSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Employee payroll name',
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

mongoose.model('EmployeePayroll', EmployeePayrollSchema);