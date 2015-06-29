'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var transportCharges = require('../../app/controllers/transport-charges.server.controller');

	// Transport charges Routes
	app.route('/transport-charges')
		.get(transportCharges.list)
		.post(users.requiresLogin, transportCharges.create);

	app.route('/transport-charges/:transportChargeId')
		.get(transportCharges.read)
		.put(users.requiresLogin, transportCharges.hasAuthorization, transportCharges.update)
		.delete(users.requiresLogin, transportCharges.hasAuthorization, transportCharges.delete);

	// Finish by binding the Transport charge middleware
	app.param('transportChargeId', transportCharges.transportChargeByID);
};
