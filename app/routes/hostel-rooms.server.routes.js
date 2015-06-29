'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var hostelRooms = require('../../app/controllers/hostel-rooms.server.controller');

	// Hostel rooms Routes
	app.route('/hostel-rooms')
		.get(hostelRooms.list)
		.post(users.requiresLogin, hostelRooms.create);

	app.route('/hostel-rooms/:hostelRoomId')
		.get(hostelRooms.read)
		.put(users.requiresLogin, hostelRooms.hasAuthorization, hostelRooms.update)
		.delete(users.requiresLogin, hostelRooms.hasAuthorization, hostelRooms.delete);

	// Finish by binding the Hostel room middleware
	app.param('hostelRoomId', hostelRooms.hostelRoomByID);
};
