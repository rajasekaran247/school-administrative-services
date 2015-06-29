'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Admission eligibility rule Schema
 */
var AdmissionEligibilityRuleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Admission eligibility rule name',
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

mongoose.model('AdmissionEligibilityRule', AdmissionEligibilityRuleSchema);