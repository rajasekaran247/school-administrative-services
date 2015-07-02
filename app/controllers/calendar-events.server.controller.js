'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	CalendarEvent = mongoose.model('CalendarEvent'),
	_ = require('lodash');

/**
 * Create a Calendar event
 */
exports.create = function(req, res) {
	var calendarEvent = new CalendarEvent(req.body);
	calendarEvent.user = req.user;

	calendarEvent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendarEvent);
		}
	});
};

/**
 * Show the current Calendar event
 */
exports.read = function(req, res) {
	res.jsonp(req.calendarEvent);
};

/**
 * Update a Calendar event
 */
exports.update = function(req, res) {
	var calendarEvent = req.calendarEvent ;

	calendarEvent = _.extend(calendarEvent , req.body);

	calendarEvent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendarEvent);
		}
	});
};

/**
 * Delete an Calendar event
 */
exports.delete = function(req, res) {
	var calendarEvent = req.calendarEvent ;

	calendarEvent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendarEvent);
		}
	});
};

/**
 * List of Calendar events
 */
exports.list = function(req, res) { 
	CalendarEvent.find().sort('-created').populate('user', 'displayName').exec(function(err, calendarEvents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendarEvents);
		}
	});
};

/**
 * Calendar event middleware
 */
exports.calendarEventByID = function(req, res, next, id) { 
	CalendarEvent.findById(id).populate('user', 'displayName').exec(function(err, calendarEvent) {
		if (err) return next(err);
		if (! calendarEvent) return next(new Error('Failed to load Calendar event ' + id));
		req.calendarEvent = calendarEvent ;
		next();
	});
};

/**
 * Calendar event authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.calendarEvent.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
