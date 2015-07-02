'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Grade = mongoose.model('Grade'),
	_ = require('lodash');

/**
 * Create a Grade
 */
exports.create = function(req, res) {
	var grade = new Grade(req.body);
	grade.user = req.user;

	grade.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grade);
		}
	});
};

/**
 * Show the current Grade
 */
exports.read = function(req, res) {
	res.jsonp(req.grade);
};

/**
 * Update a Grade
 */
exports.update = function(req, res) {
	var grade = req.grade ;

	grade = _.extend(grade , req.body);

	grade.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grade);
		}
	});
};

/**
 * Delete an Grade
 */
exports.delete = function(req, res) {
	var grade = req.grade ;

	grade.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grade);
		}
	});
};

/**
 * List of Grades
 */
exports.list = function(req, res) { 
	Grade.find().sort('-created').populate('user', 'displayName').exec(function(err, grades) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grades);
		}
	});
};

/**
 * Grade middleware
 */
exports.gradeByID = function(req, res, next, id) { 
	Grade.findById(id).populate('user', 'displayName').exec(function(err, grade) {
		if (err) return next(err);
		if (! grade) return next(new Error('Failed to load Grade ' + id));
		req.grade = grade ;
		next();
	});
};

/**
 * Grade authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.grade.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
