'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Batch = mongoose.model('Batch'),
	_ = require('lodash');

/**
 * Create a Batch
 */
exports.create = function(req, res) {
	var batch = new Batch(req.body);
	batch.user = req.user;

	batch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(batch);
		}
	});
};

/**
 * Show the current Batch
 */
exports.read = function(req, res) {
	res.jsonp(req.batch);
};

/**
 * Update a Batch
 */
exports.update = function(req, res) {
	var batch = req.batch ;

	batch = _.extend(batch , req.body);

	batch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(batch);
		}
	});
};

/**
 * Delete an Batch
 */
exports.delete = function(req, res) {
	var batch = req.batch ;

	batch.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(batch);
		}
	});
};

/**
 * List of Batches
 */
exports.list = function(req, res) { 
	Batch.find().sort('-created').populate('user', 'displayName').exec(function(err, batches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(batches);
		}
	});
};

/**
 * Batch middleware
 */
exports.batchByID = function(req, res, next, id) { 
	Batch.findById(id).populate('user', 'displayName').exec(function(err, batch) {
		if (err) return next(err);
		if (! batch) return next(new Error('Failed to load Batch ' + id));
		req.batch = batch ;
		next();
	});
};

/**
 * Batch authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.batch.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
