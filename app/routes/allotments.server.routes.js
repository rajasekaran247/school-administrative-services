'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var allotments = require('../../app/controllers/allotments.server.controller');

	// Allotments Routes
	app.route('/allotments')
		.get(allotments.list)
		.post(users.requiresLogin, allotments.create);

	app.route('/allotments/:allotmentId')
		.get(allotments.read)
		.put(users.requiresLogin, allotments.hasAuthorization, allotments.update)
		.delete(users.requiresLogin, allotments.hasAuthorization, allotments.delete);

	// Finish by binding the Allotment middleware
	app.param('allotmentId', allotments.allotmentByID);
};
