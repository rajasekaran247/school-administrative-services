'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var employeeLeaves = require('../../app/controllers/employee-leaves.server.controller');

	// Employee leaves Routes
	app.route('/employee-leaves')
		.get(employeeLeaves.list)
		.post(users.requiresLogin, employeeLeaves.create);

	app.route('/employee-leaves/:employeeLeaveId')
		.get(employeeLeaves.read)
		.put(users.requiresLogin, employeeLeaves.hasAuthorization, employeeLeaves.update)
		.delete(users.requiresLogin, employeeLeaves.hasAuthorization, employeeLeaves.delete);

	// Finish by binding the Employee leave middleware
	app.param('employeeLeaveId', employeeLeaves.employeeLeaveByID);
};
