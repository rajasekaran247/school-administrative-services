'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var charges = require('../../app/controllers/charges.server.controller');

	// Charges Routes
	app.route('/charges')
		.get(charges.list)
		.post(users.requiresLogin, charges.create);

	app.route('/charges/:chargeId')
		.get(charges.read)
		.put(users.requiresLogin, charges.hasAuthorization, charges.update)
		.delete(users.requiresLogin, charges.hasAuthorization, charges.delete);

	// Finish by binding the Charge middleware
	app.param('chargeId', charges.chargeByID);
};
