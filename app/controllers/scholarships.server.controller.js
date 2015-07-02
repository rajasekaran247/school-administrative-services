'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Scholarship = mongoose.model('Scholarship'),
	_ = require('lodash');

/**
 * Create a Scholarship
 */
exports.create = function(req, res) {
	var scholarship = new Scholarship(req.body);
	scholarship.user = req.user;

	scholarship.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(scholarship);
		}
	});
};

/**
 * Show the current Scholarship
 */
exports.read = function(req, res) {
	res.jsonp(req.scholarship);
};

/**
 * Update a Scholarship
 */
exports.update = function(req, res) {
	var scholarship = req.scholarship ;

	scholarship = _.extend(scholarship , req.body);

	scholarship.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(scholarship);
		}
	});
};

/**
 * Delete an Scholarship
 */
exports.delete = function(req, res) {
	var scholarship = req.scholarship ;

	scholarship.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(scholarship);
		}
	});
};

/**
 * List of Scholarships
 */
exports.list = function(req, res) { 
	Scholarship.find().sort('-created').populate('user', 'displayName').exec(function(err, scholarships) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(scholarships);
		}
	});
};

/**
 * Scholarship middleware
 */
exports.scholarshipByID = function(req, res, next, id) { 
	Scholarship.findById(id).populate('user', 'displayName').exec(function(err, scholarship) {
		if (err) return next(err);
		if (! scholarship) return next(new Error('Failed to load Scholarship ' + id));
		req.scholarship = scholarship ;
		next();
	});
};

/**
 * Scholarship authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.scholarship.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
