'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var batches = require('../../app/controllers/batches.server.controller');

	// Batches Routes
	app.route('/batches')
		.get(batches.list)
		.post(users.requiresLogin, batches.create);

	app.route('/batches/:batchId')
		.get(batches.read)
		.put(users.requiresLogin, batches.hasAuthorization, batches.update)
		.delete(users.requiresLogin, batches.hasAuthorization, batches.delete);

	// Finish by binding the Batch middleware
	app.param('batchId', batches.batchByID);
};
