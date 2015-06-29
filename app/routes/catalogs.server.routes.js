'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var catalogs = require('../../app/controllers/catalogs.server.controller');

	// Catalogs Routes
	app.route('/catalogs')
		.get(catalogs.list)
		.post(users.requiresLogin, catalogs.create);

	app.route('/catalogs/:catalogId')
		.get(catalogs.read)
		.put(users.requiresLogin, catalogs.hasAuthorization, catalogs.update)
		.delete(users.requiresLogin, catalogs.hasAuthorization, catalogs.delete);

	// Finish by binding the Catalog middleware
	app.param('catalogId', catalogs.catalogByID);
};
