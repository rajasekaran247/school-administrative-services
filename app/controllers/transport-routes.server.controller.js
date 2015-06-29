'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	TransportRoute = mongoose.model('TransportRoute'),
	_ = require('lodash');

/**
 * Create a Transport route
 */
exports.create = function(req, res) {
	var transportRoute = new TransportRoute(req.body);
	transportRoute.user = req.user;

	transportRoute.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transportRoute);
		}
	});
};

/**
 * Show the current Transport route
 */
exports.read = function(req, res) {
	res.jsonp(req.transportRoute);
};

/**
 * Update a Transport route
 */
exports.update = function(req, res) {
	var transportRoute = req.transportRoute ;

	transportRoute = _.extend(transportRoute , req.body);

	transportRoute.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transportRoute);
		}
	});
};

/**
 * Delete an Transport route
 */
exports.delete = function(req, res) {
	var transportRoute = req.transportRoute ;

	transportRoute.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transportRoute);
		}
	});
};

/**
 * List of Transport routes
 */
exports.list = function(req, res) { 
	TransportRoute.find().sort('-created').populate('user', 'displayName').exec(function(err, transportRoutes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transportRoutes);
		}
	});
};

/**
 * Transport route middleware
 */
exports.transportRouteByID = function(req, res, next, id) { 
	TransportRoute.findById(id).populate('user', 'displayName').exec(function(err, transportRoute) {
		if (err) return next(err);
		if (! transportRoute) return next(new Error('Failed to load Transport route ' + id));
		req.transportRoute = transportRoute ;
		next();
	});
};

/**
 * Transport route authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.transportRoute.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
