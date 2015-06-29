'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var transportRoutes = require('../../app/controllers/transport-routes.server.controller');

	// Transport routes Routes
	app.route('/transport-routes')
		.get(transportRoutes.list)
		.post(users.requiresLogin, transportRoutes.create);

	app.route('/transport-routes/:transportRouteId')
		.get(transportRoutes.read)
		.put(users.requiresLogin, transportRoutes.hasAuthorization, transportRoutes.update)
		.delete(users.requiresLogin, transportRoutes.hasAuthorization, transportRoutes.delete);

	// Finish by binding the Transport route middleware
	app.param('transportRouteId', transportRoutes.transportRouteByID);
};
