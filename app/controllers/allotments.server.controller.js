'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Allotment = mongoose.model('Allotment'),
	_ = require('lodash');

/**
 * Create a Allotment
 */
exports.create = function(req, res) {
	var allotment = new Allotment(req.body);
	allotment.user = req.user;

	allotment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(allotment);
		}
	});
};

/**
 * Show the current Allotment
 */
exports.read = function(req, res) {
	res.jsonp(req.allotment);
};

/**
 * Update a Allotment
 */
exports.update = function(req, res) {
	var allotment = req.allotment ;

	allotment = _.extend(allotment , req.body);

	allotment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(allotment);
		}
	});
};

/**
 * Delete an Allotment
 */
exports.delete = function(req, res) {
	var allotment = req.allotment ;

	allotment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(allotment);
		}
	});
};

/**
 * List of Allotments
 */
exports.list = function(req, res) { 
	Allotment.find().sort('-created').populate('user', 'displayName').exec(function(err, allotments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(allotments);
		}
	});
};

/**
 * Allotment middleware
 */
exports.allotmentByID = function(req, res, next, id) { 
	Allotment.findById(id).populate('user', 'displayName').exec(function(err, allotment) {
		if (err) return next(err);
		if (! allotment) return next(new Error('Failed to load Allotment ' + id));
		req.allotment = allotment ;
		next();
	});
};

/**
 * Allotment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.allotment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
