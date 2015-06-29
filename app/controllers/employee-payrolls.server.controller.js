'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	EmployeePayroll = mongoose.model('EmployeePayroll'),
	_ = require('lodash');

/**
 * Create a Employee payroll
 */
exports.create = function(req, res) {
	var employeePayroll = new EmployeePayroll(req.body);
	employeePayroll.user = req.user;

	employeePayroll.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeePayroll);
		}
	});
};

/**
 * Show the current Employee payroll
 */
exports.read = function(req, res) {
	res.jsonp(req.employeePayroll);
};

/**
 * Update a Employee payroll
 */
exports.update = function(req, res) {
	var employeePayroll = req.employeePayroll ;

	employeePayroll = _.extend(employeePayroll , req.body);

	employeePayroll.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeePayroll);
		}
	});
};

/**
 * Delete an Employee payroll
 */
exports.delete = function(req, res) {
	var employeePayroll = req.employeePayroll ;

	employeePayroll.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeePayroll);
		}
	});
};

/**
 * List of Employee payrolls
 */
exports.list = function(req, res) { 
	EmployeePayroll.find().sort('-created').populate('user', 'displayName').exec(function(err, employeePayrolls) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeePayrolls);
		}
	});
};

/**
 * Employee payroll middleware
 */
exports.employeePayrollByID = function(req, res, next, id) { 
	EmployeePayroll.findById(id).populate('user', 'displayName').exec(function(err, employeePayroll) {
		if (err) return next(err);
		if (! employeePayroll) return next(new Error('Failed to load Employee payroll ' + id));
		req.employeePayroll = employeePayroll ;
		next();
	});
};

/**
 * Employee payroll authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.employeePayroll.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
