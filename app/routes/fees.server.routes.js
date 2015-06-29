'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var fees = require('../../app/controllers/fees.server.controller');

	// Fees Routes
	app.route('/fees')
		.get(fees.list)
		.post(users.requiresLogin, fees.create);

	app.route('/fees/:feeId')
		.get(fees.read)
		.put(users.requiresLogin, fees.hasAuthorization, fees.update)
		.delete(users.requiresLogin, fees.hasAuthorization, fees.delete);

	// Finish by binding the Fee middleware
	app.param('feeId', fees.feeByID);
};
