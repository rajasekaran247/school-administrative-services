'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	HostelRoom = mongoose.model('HostelRoom'),
	_ = require('lodash');

/**
 * Create a Hostel room
 */
exports.create = function(req, res) {
	var hostelRoom = new HostelRoom(req.body);
	hostelRoom.user = req.user;

	hostelRoom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelRoom);
		}
	});
};

/**
 * Show the current Hostel room
 */
exports.read = function(req, res) {
	res.jsonp(req.hostelRoom);
};

/**
 * Update a Hostel room
 */
exports.update = function(req, res) {
	var hostelRoom = req.hostelRoom ;

	hostelRoom = _.extend(hostelRoom , req.body);

	hostelRoom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelRoom);
		}
	});
};

/**
 * Delete an Hostel room
 */
exports.delete = function(req, res) {
	var hostelRoom = req.hostelRoom ;

	hostelRoom.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelRoom);
		}
	});
};

/**
 * List of Hostel rooms
 */
exports.list = function(req, res) { 
	HostelRoom.find().sort('-created').populate('user', 'displayName').exec(function(err, hostelRooms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hostelRooms);
		}
	});
};

/**
 * Hostel room middleware
 */
exports.hostelRoomByID = function(req, res, next, id) { 
	HostelRoom.findById(id).populate('user', 'displayName').exec(function(err, hostelRoom) {
		if (err) return next(err);
		if (! hostelRoom) return next(new Error('Failed to load Hostel room ' + id));
		req.hostelRoom = hostelRoom ;
		next();
	});
};

/**
 * Hostel room authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.hostelRoom.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
