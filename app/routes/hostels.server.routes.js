'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var hostels = require('../../app/controllers/hostels.server.controller');

	// Hostels Routes
	app.route('/hostels')
		.get(hostels.list)
		.post(users.requiresLogin, hostels.create);

	app.route('/hostels/:hostelId')
		.get(hostels.read)
		.put(users.requiresLogin, hostels.hasAuthorization, hostels.update)
		.delete(users.requiresLogin, hostels.hasAuthorization, hostels.delete);

	// Finish by binding the Hostel middleware
	app.param('hostelId', hostels.hostelByID);
};
