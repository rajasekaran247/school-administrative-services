'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Eligibility rule Schema
 */
var EligibilityRuleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Eligibility rule name',
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

mongoose.model('EligibilityRule', EligibilityRuleSchema);