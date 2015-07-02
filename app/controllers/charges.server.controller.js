'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Charge = mongoose.model('Charge'),
	_ = require('lodash');

/**
 * Create a Charge
 */
exports.create = function(req, res) {
	var charge = new Charge(req.body);
	charge.user = req.user;

	charge.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(charge);
		}
	});
};

/**
 * Show the current Charge
 */
exports.read = function(req, res) {
	res.jsonp(req.charge);
};

/**
 * Update a Charge
 */
exports.update = function(req, res) {
	var charge = req.charge ;

	charge = _.extend(charge , req.body);

	charge.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(charge);
		}
	});
};

/**
 * Delete an Charge
 */
exports.delete = function(req, res) {
	var charge = req.charge ;

	charge.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(charge);
		}
	});
};

/**
 * List of Charges
 */
exports.list = function(req, res) { 
	Charge.find().sort('-created').populate('user', 'displayName').exec(function(err, charges) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(charges);
		}
	});
};

/**
 * Charge middleware
 */
exports.chargeByID = function(req, res, next, id) { 
	Charge.findById(id).populate('user', 'displayName').exec(function(err, charge) {
		if (err) return next(err);
		if (! charge) return next(new Error('Failed to load Charge ' + id));
		req.charge = charge ;
		next();
	});
};

/**
 * Charge authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.charge.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
