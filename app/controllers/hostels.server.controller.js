'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Hostel = mongoose.model('Hostel'),
	_ = require('lodash');

/**
 * Create a Hostel
 */
exports.create = function(req, res) {
	var hostel = new Hostel(req.body);
	hostel.user = req.user;

	hostel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostel);
		}
	});
};

/**
 * Show the current Hostel
 */
exports.read = function(req, res) {
	res.jsonp(req.hostel);
};

/**
 * Update a Hostel
 */
exports.update = function(req, res) {
	var hostel = req.hostel ;

	hostel = _.extend(hostel , req.body);

	hostel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostel);
		}
	});
};

/**
 * Delete an Hostel
 */
exports.delete = function(req, res) {
	var hostel = req.hostel ;

	hostel.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostel);
		}
	});
};

/**
 * List of Hostels
 */
exports.list = function(req, res) { 
	Hostel.find().sort('-created').populate('user', 'displayName').exec(function(err, hostels) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostels);
		}
	});
};

/**
 * Hostel middleware
 */
exports.hostelByID = function(req, res, next, id) { 
	Hostel.findById(id).populate('user', 'displayName').exec(function(err, hostel) {
		if (err) return next(err);
		if (! hostel) return next(new Error('Failed to load Hostel ' + id));
		req.hostel = hostel ;
		next();
	});
};

/**
 * Hostel authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.hostel.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
