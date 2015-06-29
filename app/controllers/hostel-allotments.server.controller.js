'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	HostelAllotment = mongoose.model('HostelAllotment'),
	_ = require('lodash');

/**
 * Create a Hostel allotment
 */
exports.create = function(req, res) {
	var hostelAllotment = new HostelAllotment(req.body);
	hostelAllotment.user = req.user;

	hostelAllotment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelAllotment);
		}
	});
};

/**
 * Show the current Hostel allotment
 */
exports.read = function(req, res) {
	res.jsonp(req.hostelAllotment);
};

/**
 * Update a Hostel allotment
 */
exports.update = function(req, res) {
	var hostelAllotment = req.hostelAllotment ;

	hostelAllotment = _.extend(hostelAllotment , req.body);

	hostelAllotment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelAllotment);
		}
	});
};

/**
 * Delete an Hostel allotment
 */
exports.delete = function(req, res) {
	var hostelAllotment = req.hostelAllotment ;

	hostelAllotment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelAllotment);
		}
	});
};

/**
 * List of Hostel allotments
 */
exports.list = function(req, res) { 
	HostelAllotment.find().sort('-created').populate('user', 'displayName').exec(function(err, hostelAllotments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelAllotments);
		}
	});
};

/**
 * Hostel allotment middleware
 */
exports.hostelAllotmentByID = function(req, res, next, id) { 
	HostelAllotment.findById(id).populate('user', 'displayName').exec(function(err, hostelAllotment) {
		if (err) return next(err);
		if (! hostelAllotment) return next(new Error('Failed to load Hostel allotment ' + id));
		req.hostelAllotment = hostelAllotment ;
		next();
	});
};

/**
 * Hostel allotment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.hostelAllotment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
