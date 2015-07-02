'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Vehicle log Schema
 */
var VehicleLogSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Vehicle log name',
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

mongoose.model('VehicleLog', VehicleLogSchema);