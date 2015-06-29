'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	AdmissionApplication = mongoose.model('AdmissionApplication'),
	_ = require('lodash');

/**
 * Create a Admission application
 */
exports.create = function(req, res) {
	var admissionApplication = new AdmissionApplication(req.body);
	admissionApplication.user = req.user;

	admissionApplication.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admissionApplication);
		}
	});
};

/**
 * Show the current Admission application
 */
exports.read = function(req, res) {
	res.jsonp(req.admissionApplication);
};

/**
 * Update a Admission application
 */
exports.update = function(req, res) {
	var admissionApplication = req.admissionApplication ;

	admissionApplication = _.extend(admissionApplication , req.body);

	admissionApplication.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admissionApplication);
		}
	});
};

/**
 * Delete an Admission application
 */
exports.delete = function(req, res) {
	var admissionApplication = req.admissionApplication ;

	admissionApplication.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admissionApplication);
		}
	});
};

/**
 * List of Admission applications
 */
exports.list = function(req, res) { 
	AdmissionApplication.find().sort('-created').populate('user', 'displayName').exec(function(err, admissionApplications) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admissionApplications);
		}
	});
};

/**
 * Admission application middleware
 */
exports.admissionApplicationByID = function(req, res, next, id) { 
	AdmissionApplication.findById(id).populate('user', 'displayName').exec(function(err, admissionApplication) {
		if (err) return next(err);
		if (! admissionApplication) return next(new Error('Failed to load Admission application ' + id));
		req.admissionApplication = admissionApplication ;
		next();
	});
};

/**
 * Admission application authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.admissionApplication.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
