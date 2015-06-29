'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var routes = require('../../app/controllers/routes.server.controller');

	// Routes Routes
	app.route('/routes')
		.get(routes.list)
		.post(users.requiresLogin, routes.create);

	app.route('/routes/:routeId')
		.get(routes.read)
		.put(users.requiresLogin, routes.hasAuthorization, routes.update)
		.delete(users.requiresLogin, routes.hasAuthorization, routes.delete);

	// Finish by binding the Route middleware
	app.param('routeId', routes.routeByID);
};
