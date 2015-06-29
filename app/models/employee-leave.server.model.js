'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Employee leave Schema
 */
var EmployeeLeaveSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Employee leave name',
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

mongoose.model('EmployeeLeave', EmployeeLeaveSchema);