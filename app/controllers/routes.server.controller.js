'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Route = mongoose.model('Route'),
	_ = require('lodash');

/**
 * Create a Route
 */
exports.create = function(req, res) {
	var route = new Route(req.body);
	route.user = req.user;

	route.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(route);
		}
	});
};

/**
 * Show the current Route
 */
exports.read = function(req, res) {
	res.jsonp(req.route);
};

/**
 * Update a Route
 */
exports.update = function(req, res) {
	var route = req.route ;

	route = _.extend(route , req.body);

	route.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(route);
		}
	});
};

/**
 * Delete an Route
 */
exports.delete = function(req, res) {
	var route = req.route ;

	route.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(route);
		}
	});
};

/**
 * List of Routes
 */
exports.list = function(req, res) { 
	Route.find().sort('-created').populate('user', 'displayName').exec(function(err, routes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(routes);
		}
	});
};

/**
 * Route middleware
 */
exports.routeByID = function(req, res, next, id) { 
	Route.findById(id).populate('user', 'displayName').exec(function(err, route) {
		if (err) return next(err);
		if (! route) return next(new Error('Failed to load Route ' + id));
		req.route = route ;
		next();
	});
};

/**
 * Route authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.route.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
