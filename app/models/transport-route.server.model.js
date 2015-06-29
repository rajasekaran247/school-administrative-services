'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Transport route Schema
 */
var TransportRouteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Transport route name',
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

mongoose.model('TransportRoute', TransportRouteSchema);