'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Library = mongoose.model('Library'),
	_ = require('lodash');

/**
 * Create a Library
 */
exports.create = function(req, res) {
	var library = new Library(req.body);
	library.user = req.user;

	library.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(library);
		}
	});
};

/**
 * Show the current Library
 */
exports.read = function(req, res) {
	res.jsonp(req.library);
};

/**
 * Update a Library
 */
exports.update = function(req, res) {
	var library = req.library ;

	library = _.extend(library , req.body);

	library.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(library);
		}
	});
};

/**
 * Delete an Library
 */
exports.delete = function(req, res) {
	var library = req.library ;

	library.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(library);
		}
	});
};

/**
 * List of Libraries
 */
exports.list = function(req, res) { 
	Library.find().sort('-created').populate('user', 'displayName').exec(function(err, libraries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(libraries);
		}
	});
};

/**
 * Library middleware
 */
exports.libraryByID = function(req, res, next, id) { 
	Library.findById(id).populate('user', 'displayName').exec(function(err, library) {
		if (err) return next(err);
		if (! library) return next(new Error('Failed to load Library ' + id));
		req.library = library ;
		next();
	});
};

/**
 * Library authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.library.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
