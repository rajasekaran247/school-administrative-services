'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	GateRegister = mongoose.model('GateRegister'),
	_ = require('lodash');

/**
 * Create a Gate register
 */
exports.create = function(req, res) {
	var gateRegister = new GateRegister(req.body);
	gateRegister.user = req.user;

	gateRegister.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateRegister);
		}
	});
};

/**
 * Show the current Gate register
 */
exports.read = function(req, res) {
	res.jsonp(req.gateRegister);
};

/**
 * Update a Gate register
 */
exports.update = function(req, res) {
	var gateRegister = req.gateRegister ;

	gateRegister = _.extend(gateRegister , req.body);

	gateRegister.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateRegister);
		}
	});
};

/**
 * Delete an Gate register
 */
exports.delete = function(req, res) {
	var gateRegister = req.gateRegister ;

	gateRegister.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateRegister);
		}
	});
};

/**
 * List of Gate registers
 */
exports.list = function(req, res) { 
	GateRegister.find().sort('-created').populate('user', 'displayName').exec(function(err, gateRegisters) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gateRegisters);
		}
	});
};

/**
 * Gate register middleware
 */
exports.gateRegisterByID = function(req, res, next, id) { 
	GateRegister.findById(id).populate('user', 'displayName').exec(function(err, gateRegister) {
		if (err) return next(err);
		if (! gateRegister) return next(new Error('Failed to load Gate register ' + id));
		req.gateRegister = gateRegister ;
		next();
	});
};

/**
 * Gate register authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.gateRegister.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
