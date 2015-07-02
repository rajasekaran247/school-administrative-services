'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var leaves = require('../../app/controllers/leaves.server.controller');

	// Leaves Routes
	app.route('/leaves')
		.get(leaves.list)
		.post(users.requiresLogin, leaves.create);

	app.route('/leaves/:leaveId')
		.get(leaves.read)
		.put(users.requiresLogin, leaves.hasAuthorization, leaves.update)
		.delete(users.requiresLogin, leaves.hasAuthorization, leaves.delete);

	// Finish by binding the Leave middleware
	app.param('leaveId', leaves.leaveByID);
};
