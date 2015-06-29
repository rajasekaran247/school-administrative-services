'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	HostelRoomRequest = mongoose.model('HostelRoomRequest'),
	_ = require('lodash');

/**
 * Create a Hostel room request
 */
exports.create = function(req, res) {
	var hostelRoomRequest = new HostelRoomRequest(req.body);
	hostelRoomRequest.user = req.user;

	hostelRoomRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelRoomRequest);
		}
	});
};

/**
 * Show the current Hostel room request
 */
exports.read = function(req, res) {
	res.jsonp(req.hostelRoomRequest);
};

/**
 * Update a Hostel room request
 */
exports.update = function(req, res) {
	var hostelRoomRequest = req.hostelRoomRequest ;

	hostelRoomRequest = _.extend(hostelRoomRequest , req.body);

	hostelRoomRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelRoomRequest);
		}
	});
};

/**
 * Delete an Hostel room request
 */
exports.delete = function(req, res) {
	var hostelRoomRequest = req.hostelRoomRequest ;

	hostelRoomRequest.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelRoomRequest);
		}
	});
};

/**
 * List of Hostel room requests
 */
exports.list = function(req, res) { 
	HostelRoomRequest.find().sort('-created').populate('user', 'displayName').exec(function(err, hostelRoomRequests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelRoomRequests);
		}
	});
};

/**
 * Hostel room request middleware
 */
exports.hostelRoomRequestByID = function(req, res, next, id) { 
	HostelRoomRequest.findById(id).populate('user', 'displayName').exec(function(err, hostelRoomRequest) {
		if (err) return next(err);
		if (! hostelRoomRequest) return next(new Error('Failed to load Hostel room request ' + id));
		req.hostelRoomRequest = hostelRoomRequest ;
		next();
	});
};

/**
 * Hostel room request authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.hostelRoomRequest.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
