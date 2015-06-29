'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	EmployeeLoan = mongoose.model('EmployeeLoan'),
	_ = require('lodash');

/**
 * Create a Employee loan
 */
exports.create = function(req, res) {
	var employeeLoan = new EmployeeLoan(req.body);
	employeeLoan.user = req.user;

	employeeLoan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeeLoan);
		}
	});
};

/**
 * Show the current Employee loan
 */
exports.read = function(req, res) {
	res.jsonp(req.employeeLoan);
};

/**
 * Update a Employee loan
 */
exports.update = function(req, res) {
	var employeeLoan = req.employeeLoan ;

	employeeLoan = _.extend(employeeLoan , req.body);

	employeeLoan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeeLoan);
		}
	});
};

/**
 * Delete an Employee loan
 */
exports.delete = function(req, res) {
	var employeeLoan = req.employeeLoan ;

	employeeLoan.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeeLoan);
		}
	});
};

/**
 * List of Employee loans
 */
exports.list = function(req, res) { 
	EmployeeLoan.find().sort('-created').populate('user', 'displayName').exec(function(err, employeeLoans) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employeeLoans);
		}
	});
};

/**
 * Employee loan middleware
 */
exports.employeeLoanByID = function(req, res, next, id) { 
	EmployeeLoan.findById(id).populate('user', 'displayName').exec(function(err, employeeLoan) {
		if (err) return next(err);
		if (! employeeLoan) return next(new Error('Failed to load Employee loan ' + id));
		req.employeeLoan = employeeLoan ;
		next();
	});
};

/**
 * Employee loan authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.employeeLoan.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
