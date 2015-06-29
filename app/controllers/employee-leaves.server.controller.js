'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	EmployeeLeave = mongoose.model('EmployeeLeave'),
	_ = require('lodash');

/**
 * Create a Employee leave
 */
exports.create = function(req, res) {
	var employeeLeave = new EmployeeLeave(req.body);
	employeeLeave.user = req.user;

	employeeLeave.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeeLeave);
		}
	});
};

/**
 * Show the current Employee leave
 */
exports.read = function(req, res) {
	res.jsonp(req.employeeLeave);
};

/**
 * Update a Employee leave
 */
exports.update = function(req, res) {
	var employeeLeave = req.employeeLeave ;

	employeeLeave = _.extend(employeeLeave , req.body);

	employeeLeave.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeeLeave);
		}
	});
};

/**
 * Delete an Employee leave
 */
exports.delete = function(req, res) {
	var employeeLeave = req.employeeLeave ;

	employeeLeave.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeeLeave);
		}
	});
};

/**
 * List of Employee leaves
 */
exports.list = function(req, res) { 
	EmployeeLeave.find().sort('-created').populate('user', 'displayName').exec(function(err, employeeLeaves) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeeLeaves);
		}
	});
};

/**
 * Employee leave middleware
 */
exports.employeeLeaveByID = function(req, res, next, id) { 
	EmployeeLeave.findById(id).populate('user', 'displayName').exec(function(err, employeeLeave) {
		if (err) return next(err);
		if (! employeeLeave) return next(new Error('Failed to load Employee leave ' + id));
		req.employeeLeave = employeeLeave ;
		next();
	});
};

/**
 * Employee leave authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.employeeLeave.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
