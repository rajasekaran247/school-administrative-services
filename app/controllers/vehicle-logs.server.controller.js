'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	VehicleLog = mongoose.model('VehicleLog'),
	_ = require('lodash');

/**
 * Create a Vehicle log
 */
exports.create = function(req, res) {
	var vehicleLog = new VehicleLog(req.body);
	vehicleLog.user = req.user;

	vehicleLog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vehicleLog);
		}
	});
};

/**
 * Show the current Vehicle log
 */
exports.read = function(req, res) {
	res.jsonp(req.vehicleLog);
};

/**
 * Update a Vehicle log
 */
exports.update = function(req, res) {
	var vehicleLog = req.vehicleLog ;

	vehicleLog = _.extend(vehicleLog , req.body);

	vehicleLog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vehicleLog);
		}
	});
};

/**
 * Delete an Vehicle log
 */
exports.delete = function(req, res) {
	var vehicleLog = req.vehicleLog ;

	vehicleLog.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vehicleLog);
		}
	});
};

/**
 * List of Vehicle logs
 */
exports.list = function(req, res) { 
	VehicleLog.find().sort('-created').populate('user', 'displayName').exec(function(err, vehicleLogs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vehicleLogs);
		}
	});
};

/**
 * Vehicle log middleware
 */
exports.vehicleLogByID = function(req, res, next, id) { 
	VehicleLog.findById(id).populate('user', 'displayName').exec(function(err, vehicleLog) {
		if (err) return next(err);
		if (! vehicleLog) return next(new Error('Failed to load Vehicle log ' + id));
		req.vehicleLog = vehicleLog ;
		next();
	});
};

/**
 * Vehicle log authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.vehicleLog.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
