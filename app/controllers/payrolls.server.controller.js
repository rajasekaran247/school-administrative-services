'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Payroll = mongoose.model('Payroll'),
	_ = require('lodash');

/**
 * Create a Payroll
 */
exports.create = function(req, res) {
	var payroll = new Payroll(req.body);
	payroll.user = req.user;

	payroll.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(payroll);
		}
	});
};

/**
 * Show the current Payroll
 */
exports.read = function(req, res) {
	res.jsonp(req.payroll);
};

/**
 * Update a Payroll
 */
exports.update = function(req, res) {
	var payroll = req.payroll ;

	payroll = _.extend(payroll , req.body);

	payroll.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(payroll);
		}
	});
};

/**
 * Delete an Payroll
 */
exports.delete = function(req, res) {
	var payroll = req.payroll ;

	payroll.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(payroll);
		}
	});
};

/**
 * List of Payrolls
 */
exports.list = function(req, res) { 
	Payroll.find().sort('-created').populate('user', 'displayName').exec(function(err, payrolls) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(payrolls);
		}
	});
};

/**
 * Payroll middleware
 */
exports.payrollByID = function(req, res, next, id) { 
	Payroll.findById(id).populate('user', 'displayName').exec(function(err, payroll) {
		if (err) return next(err);
		if (! payroll) return next(new Error('Failed to load Payroll ' + id));
		req.payroll = payroll ;
		next();
	});
};

/**
 * Payroll authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.payroll.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
