'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var vehicleLogs = require('../../app/controllers/vehicle-logs.server.controller');

	// Vehicle logs Routes
	app.route('/vehicle-logs')
		.get(vehicleLogs.list)
		.post(users.requiresLogin, vehicleLogs.create);

	app.route('/vehicle-logs/:vehicleLogId')
		.get(vehicleLogs.read)
		.put(users.requiresLogin, vehicleLogs.hasAuthorization, vehicleLogs.update)
		.delete(users.requiresLogin, vehicleLogs.hasAuthorization, vehicleLogs.delete);

	// Finish by binding the Vehicle log middleware
	app.param('vehicleLogId', vehicleLogs.vehicleLogByID);
};
