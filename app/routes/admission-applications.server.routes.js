'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var admissionApplications = require('../../app/controllers/admission-applications.server.controller');

	// Admission applications Routes
	app.route('/admission-applications')
		.get(admissionApplications.list)
		.post(users.requiresLogin, admissionApplications.create);

	app.route('/admission-applications/:admissionApplicationId')
		.get(admissionApplications.read)
		.put(users.requiresLogin, admissionApplications.hasAuthorization, admissionApplications.update)
		.delete(users.requiresLogin, admissionApplications.hasAuthorization, admissionApplications.delete);

	// Finish by binding the Admission application middleware
	app.param('admissionApplicationId', admissionApplications.admissionApplicationByID);
};
