'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Gate register Schema
 */
var GateRegisterSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Gate register name',
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

mongoose.model('GateRegister', GateRegisterSchema);