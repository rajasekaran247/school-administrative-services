'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var libraries = require('../../app/controllers/libraries.server.controller');

	// Libraries Routes
	app.route('/libraries')
		.get(libraries.list)
		.post(users.requiresLogin, libraries.create);

	app.route('/libraries/:libraryId')
		.get(libraries.read)
		.put(users.requiresLogin, libraries.hasAuthorization, libraries.update)
		.delete(users.requiresLogin, libraries.hasAuthorization, libraries.delete);

	// Finish by binding the Library middleware
	app.param('libraryId', libraries.libraryByID);
};
