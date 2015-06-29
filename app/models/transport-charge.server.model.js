'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Transport charge Schema
 */
var TransportChargeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Transport charge name',
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

mongoose.model('TransportCharge', TransportChargeSchema);