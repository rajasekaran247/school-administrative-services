'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var vouchers = require('../../app/controllers/vouchers.server.controller');

	// Vouchers Routes
	app.route('/vouchers')
		.get(vouchers.list)
		.post(users.requiresLogin, vouchers.create);

	app.route('/vouchers/:voucherId')
		.get(vouchers.read)
		.put(users.requiresLogin, vouchers.hasAuthorization, vouchers.update)
		.delete(users.requiresLogin, vouchers.hasAuthorization, vouchers.delete);

	// Finish by binding the Voucher middleware
	app.param('voucherId', vouchers.voucherByID);
};
