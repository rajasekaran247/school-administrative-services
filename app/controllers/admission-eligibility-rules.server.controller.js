'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	AdmissionEligibilityRule = mongoose.model('AdmissionEligibilityRule'),
	_ = require('lodash');

/**
 * Create a Admission eligibility rule
 */
exports.create = function(req, res) {
	var admissionEligibilityRule = new AdmissionEligibilityRule(req.body);
	admissionEligibilityRule.user = req.user;

	admissionEligibilityRule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admissionEligibilityRule);
		}
	});
};

/**
 * Show the current Admission eligibility rule
 */
exports.read = function(req, res) {
	res.jsonp(req.admissionEligibilityRule);
};

/**
 * Update a Admission eligibility rule
 */
exports.update = function(req, res) {
	var admissionEligibilityRule = req.admissionEligibilityRule ;

	admissionEligibilityRule = _.extend(admissionEligibilityRule , req.body);

	admissionEligibilityRule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admissionEligibilityRule);
		}
	});
};

/**
 * Delete an Admission eligibility rule
 */
exports.delete = function(req, res) {
	var admissionEligibilityRule = req.admissionEligibilityRule ;

	admissionEligibilityRule.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admissionEligibilityRule);
		}
	});
};

/**
 * List of Admission eligibility rules
 */
exports.list = function(req, res) { 
	AdmissionEligibilityRule.find().sort('-created').populate('user', 'displayName').exec(function(err, admissionEligibilityRules) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admissionEligibilityRules);
		}
	});
};

/**
 * Admission eligibility rule middleware
 */
exports.admissionEligibilityRuleByID = function(req, res, next, id) { 
	AdmissionEligibilityRule.findById(id).populate('user', 'displayName').exec(function(err, admissionEligibilityRule) {
		if (err) return next(err);
		if (! admissionEligibilityRule) return next(new Error('Failed to load Admission eligibility rule ' + id));
		req.admissionEligibilityRule = admissionEligibilityRule ;
		next();
	});
};

/**
 * Admission eligibility rule authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.admissionEligibilityRule.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
