'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var roomRequests = require('../../app/controllers/room-requests.server.controller');

	// Room requests Routes
	app.route('/room-requests')
		.get(roomRequests.list)
		.post(users.requiresLogin, roomRequests.create);

	app.route('/room-requests/:roomRequestId')
		.get(roomRequests.read)
		.put(users.requiresLogin, roomRequests.hasAuthorization, roomRequests.update)
		.delete(users.requiresLogin, roomRequests.hasAuthorization, roomRequests.delete);

	// Finish by binding the Room request middleware
	app.param('roomRequestId', roomRequests.roomRequestByID);
};
