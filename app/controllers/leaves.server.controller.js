'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Leave = mongoose.model('Leave'),
	_ = require('lodash');

/**
 * Create a Leave
 */
exports.create = function(req, res) {
	var leave = new Leave(req.body);
	leave.user = req.user;

	leave.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(leave);
		}
	});
};

/**
 * Show the current Leave
 */
exports.read = function(req, res) {
	res.jsonp(req.leave);
};

/**
 * Update a Leave
 */
exports.update = function(req, res) {
	var leave = req.leave ;

	leave = _.extend(leave , req.body);

	leave.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(leave);
		}
	});
};

/**
 * Delete an Leave
 */
exports.delete = function(req, res) {
	var leave = req.leave ;

	leave.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(leave);
		}
	});
};

/**
 * List of Leaves
 */
exports.list = function(req, res) { 
	Leave.find().sort('-created').populate('user', 'displayName').exec(function(err, leaves) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(leaves);
		}
	});
};

/**
 * Leave middleware
 */
exports.leaveByID = function(req, res, next, id) { 
	Leave.findById(id).populate('user', 'displayName').exec(function(err, leave) {
		if (err) return next(err);
		if (! leave) return next(new Error('Failed to load Leave ' + id));
		req.leave = leave ;
		next();
	});
};

/**
 * Leave authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.leave.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
