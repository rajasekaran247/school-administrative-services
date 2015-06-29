'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Catalog = mongoose.model('Catalog'),
	_ = require('lodash');

/**
 * Create a Catalog
 */
exports.create = function(req, res) {
	var catalog = new Catalog(req.body);
	catalog.user = req.user;

	catalog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(catalog);
		}
	});
};

/**
 * Show the current Catalog
 */
exports.read = function(req, res) {
	res.jsonp(req.catalog);
};

/**
 * Update a Catalog
 */
exports.update = function(req, res) {
	var catalog = req.catalog ;

	catalog = _.extend(catalog , req.body);

	catalog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(catalog);
		}
	});
};

/**
 * Delete an Catalog
 */
exports.delete = function(req, res) {
	var catalog = req.catalog ;

	catalog.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(catalog);
		}
	});
};

/**
 * List of Catalogs
 */
exports.list = function(req, res) { 
	Catalog.find().sort('-created').populate('user', 'displayName').exec(function(err, catalogs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(catalogs);
		}
	});
};

/**
 * Catalog middleware
 */
exports.catalogByID = function(req, res, next, id) { 
	Catalog.findById(id).populate('user', 'displayName').exec(function(err, catalog) {
		if (err) return next(err);
		if (! catalog) return next(new Error('Failed to load Catalog ' + id));
		req.catalog = catalog ;
		next();
	});
};

/**
 * Catalog authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.catalog.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
