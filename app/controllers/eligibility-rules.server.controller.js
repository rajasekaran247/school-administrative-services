'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	EligibilityRule = mongoose.model('EligibilityRule'),
	_ = require('lodash');

/**
 * Create a Eligibility rule
 */
exports.create = function(req, res) {
	var eligibilityRule = new EligibilityRule(req.body);
	eligibilityRule.user = req.user;

	eligibilityRule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eligibilityRule);
		}
	});
};

/**
 * Show the current Eligibility rule
 */
exports.read = function(req, res) {
	res.jsonp(req.eligibilityRule);
};

/**
 * Update a Eligibility rule
 */
exports.update = function(req, res) {
	var eligibilityRule = req.eligibilityRule ;

	eligibilityRule = _.extend(eligibilityRule , req.body);

	eligibilityRule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eligibilityRule);
		}
	});
};

/**
 * Delete an Eligibility rule
 */
exports.delete = function(req, res) {
	var eligibilityRule = req.eligibilityRule ;

	eligibilityRule.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eligibilityRule);
		}
	});
};

/**
 * List of Eligibility rules
 */
exports.list = function(req, res) { 
	EligibilityRule.find().sort('-created').populate('user', 'displayName').exec(function(err, eligibilityRules) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eligibilityRules);
		}
	});
};

/**
 * Eligibility rule middleware
 */
exports.eligibilityRuleByID = function(req, res, next, id) { 
	EligibilityRule.findById(id).populate('user', 'displayName').exec(function(err, eligibilityRule) {
		if (err) return next(err);
		if (! eligibilityRule) return next(new Error('Failed to load Eligibility rule ' + id));
		req.eligibilityRule = eligibilityRule ;
		next();
	});
};

/**
 * Eligibility rule authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.eligibilityRule.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
