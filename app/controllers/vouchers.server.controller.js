'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Voucher = mongoose.model('Voucher'),
	_ = require('lodash');

/**
 * Create a Voucher
 */
exports.create = function(req, res) {
	var voucher = new Voucher(req.body);
	voucher.user = req.user;

	voucher.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(voucher);
		}
	});
};

/**
 * Show the current Voucher
 */
exports.read = function(req, res) {
	res.jsonp(req.voucher);
};

/**
 * Update a Voucher
 */
exports.update = function(req, res) {
	var voucher = req.voucher ;

	voucher = _.extend(voucher , req.body);

	voucher.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(voucher);
		}
	});
};

/**
 * Delete an Voucher
 */
exports.delete = function(req, res) {
	var voucher = req.voucher ;

	voucher.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(voucher);
		}
	});
};

/**
 * List of Vouchers
 */
exports.list = function(req, res) { 
	Voucher.find().sort('-created').populate('user', 'displayName').exec(function(err, vouchers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vouchers);
		}
	});
};

/**
 * Voucher middleware
 */
exports.voucherByID = function(req, res, next, id) { 
	Voucher.findById(id).populate('user', 'displayName').exec(function(err, voucher) {
		if (err) return next(err);
		if (! voucher) return next(new Error('Failed to load Voucher ' + id));
		req.voucher = voucher ;
		next();
	});
};

/**
 * Voucher authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.voucher.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
