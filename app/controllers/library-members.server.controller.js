'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	LibraryMember = mongoose.model('LibraryMember'),
	_ = require('lodash');

/**
 * Create a Library member
 */
exports.create = function(req, res) {
	var libraryMember = new LibraryMember(req.body);
	libraryMember.user = req.user;

	libraryMember.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(libraryMember);
		}
	});
};

/**
 * Show the current Library member
 */
exports.read = function(req, res) {
	res.jsonp(req.libraryMember);
};

/**
 * Update a Library member
 */
exports.update = function(req, res) {
	var libraryMember = req.libraryMember ;

	libraryMember = _.extend(libraryMember , req.body);

	libraryMember.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(libraryMember);
		}
	});
};

/**
 * Delete an Library member
 */
exports.delete = function(req, res) {
	var libraryMember = req.libraryMember ;

	libraryMember.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(libraryMember);
		}
	});
};

/**
 * List of Library members
 */
exports.list = function(req, res) { 
	LibraryMember.find().sort('-created').populate('user', 'displayName').exec(function(err, libraryMembers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(libraryMembers);
		}
	});
};

/**
 * Library member middleware
 */
exports.libraryMemberByID = function(req, res, next, id) { 
	LibraryMember.findById(id).populate('user', 'displayName').exec(function(err, libraryMember) {
		if (err) return next(err);
		if (! libraryMember) return next(new Error('Failed to load Library member ' + id));
		req.libraryMember = libraryMember ;
		next();
	});
};

/**
 * Library member authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.libraryMember.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
