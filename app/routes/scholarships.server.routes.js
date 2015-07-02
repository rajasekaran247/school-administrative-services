'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var scholarships = require('../../app/controllers/scholarships.server.controller');

	// Scholarships Routes
	app.route('/scholarships')
		.get(scholarships.list)
		.post(users.requiresLogin, scholarships.create);

	app.route('/scholarships/:scholarshipId')
		.get(scholarships.read)
		.put(users.requiresLogin, scholarships.hasAuthorization, scholarships.update)
		.delete(users.requiresLogin, scholarships.hasAuthorization, scholarships.delete);

	// Finish by binding the Scholarship middleware
	app.param('scholarshipId', scholarships.scholarshipByID);
};
