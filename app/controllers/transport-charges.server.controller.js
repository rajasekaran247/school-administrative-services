'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	TransportCharge = mongoose.model('TransportCharge'),
	_ = require('lodash');

/**
 * Create a Transport charge
 */
exports.create = function(req, res) {
	var transportCharge = new TransportCharge(req.body);
	transportCharge.user = req.user;

	transportCharge.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transportCharge);
		}
	});
};

/**
 * Show the current Transport charge
 */
exports.read = function(req, res) {
	res.jsonp(req.transportCharge);
};

/**
 * Update a Transport charge
 */
exports.update = function(req, res) {
	var transportCharge = req.transportCharge ;

	transportCharge = _.extend(transportCharge , req.body);

	transportCharge.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transportCharge);
		}
	});
};

/**
 * Delete an Transport charge
 */
exports.delete = function(req, res) {
	var transportCharge = req.transportCharge ;

	transportCharge.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transportCharge);
		}
	});
};

/**
 * List of Transport charges
 */
exports.list = function(req, res) { 
	TransportCharge.find().sort('-created').populate('user', 'displayName').exec(function(err, transportCharges) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transportCharges);
		}
	});
};

/**
 * Transport charge middleware
 */
exports.transportChargeByID = function(req, res, next, id) { 
	TransportCharge.findById(id).populate('user', 'displayName').exec(function(err, transportCharge) {
		if (err) return next(err);
		if (! transportCharge) return next(new Error('Failed to load Transport charge ' + id));
		req.transportCharge = transportCharge ;
		next();
	});
};

/**
 * Transport charge authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.transportCharge.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
