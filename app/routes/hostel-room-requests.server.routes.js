'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var hostelRoomRequests = require('../../app/controllers/hostel-room-requests.server.controller');

	// Hostel room requests Routes
	app.route('/hostel-room-requests')
		.get(hostelRoomRequests.list)
		.post(users.requiresLogin, hostelRoomRequests.create);

	app.route('/hostel-room-requests/:hostelRoomRequestId')
		.get(hostelRoomRequests.read)
		.put(users.requiresLogin, hostelRoomRequests.hasAuthorization, hostelRoomRequests.update)
		.delete(users.requiresLogin, hostelRoomRequests.hasAuthorization, hostelRoomRequests.delete);

	// Finish by binding the Hostel room request middleware
	app.param('hostelRoomRequestId', hostelRoomRequests.hostelRoomRequestByID);
};
