'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Hostel allotment Schema
 */
var HostelAllotmentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Hostel allotment name',
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

mongoose.model('HostelAllotment', HostelAllotmentSchema);