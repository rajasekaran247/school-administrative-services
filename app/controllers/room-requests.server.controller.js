'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	RoomRequest = mongoose.model('RoomRequest'),
	_ = require('lodash');

/**
 * Create a Room request
 */
exports.create = function(req, res) {
	var roomRequest = new RoomRequest(req.body);
	roomRequest.user = req.user;

	roomRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roomRequest);
		}
	});
};

/**
 * Show the current Room request
 */
exports.read = function(req, res) {
	res.jsonp(req.roomRequest);
};

/**
 * Update a Room request
 */
exports.update = function(req, res) {
	var roomRequest = req.roomRequest ;

	roomRequest = _.extend(roomRequest , req.body);

	roomRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roomRequest);
		}
	});
};

/**
 * Delete an Room request
 */
exports.delete = function(req, res) {
	var roomRequest = req.roomRequest ;

	roomRequest.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roomRequest);
		}
	});
};

/**
 * List of Room requests
 */
exports.list = function(req, res) { 
	RoomRequest.find().sort('-created').populate('user', 'displayName').exec(function(err, roomRequests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roomRequests);
		}
	});
};

/**
 * Room request middleware
 */
exports.roomRequestByID = function(req, res, next, id) { 
	RoomRequest.findById(id).populate('user', 'displayName').exec(function(err, roomRequest) {
		if (err) return next(err);
		if (! roomRequest) return next(new Error('Failed to load Room request ' + id));
		req.roomRequest = roomRequest ;
		next();
	});
};

/**
 * Room request authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.roomRequest.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
