'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var hostelAllotments = require('../../app/controllers/hostel-allotments.server.controller');

	// Hostel allotments Routes
	app.route('/hostel-allotments')
		.get(hostelAllotments.list)
		.post(users.requiresLogin, hostelAllotments.create);

	app.route('/hostel-allotments/:hostelAllotmentId')
		.get(hostelAllotments.read)
		.put(users.requiresLogin, hostelAllotments.hasAuthorization, hostelAllotments.update)
		.delete(users.requiresLogin, hostelAllotments.hasAuthorization, hostelAllotments.delete);

	// Finish by binding the Hostel allotment middleware
	app.param('hostelAllotmentId', hostelAllotments.hostelAllotmentByID);
};
