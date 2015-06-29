'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Fee = mongoose.model('Fee'),
	_ = require('lodash');

/**
 * Create a Fee
 */
exports.create = function(req, res) {
	var fee = new Fee(req.body);
	fee.user = req.user;

	fee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fee);
		}
	});
};

/**
 * Show the current Fee
 */
exports.read = function(req, res) {
	res.jsonp(req.fee);
};

/**
 * Update a Fee
 */
exports.update = function(req, res) {
	var fee = req.fee ;

	fee = _.extend(fee , req.body);

	fee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fee);
		}
	});
};

/**
 * Delete an Fee
 */
exports.delete = function(req, res) {
	var fee = req.fee ;

	fee.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fee);
		}
	});
};

/**
 * List of Fees
 */
exports.list = function(req, res) { 
	Fee.find().sort('-created').populate('user', 'displayName').exec(function(err, fees) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fees);
		}
	});
};

/**
 * Fee middleware
 */
exports.feeByID = function(req, res, next, id) { 
	Fee.findById(id).populate('user', 'displayName').exec(function(err, fee) {
		if (err) return next(err);
		if (! fee) return next(new Error('Failed to load Fee ' + id));
		req.fee = fee ;
		next();
	});
};

/**
 * Fee authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.fee.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
