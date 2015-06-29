'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var employeeLoans = require('../../app/controllers/employee-loans.server.controller');

	// Employee loans Routes
	app.route('/employee-loans')
		.get(employeeLoans.list)
		.post(users.requiresLogin, employeeLoans.create);

	app.route('/employee-loans/:employeeLoanId')
		.get(employeeLoans.read)
		.put(users.requiresLogin, employeeLoans.hasAuthorization, employeeLoans.update)
		.delete(users.requiresLogin, employeeLoans.hasAuthorization, employeeLoans.delete);

	// Finish by binding the Employee loan middleware
	app.param('employeeLoanId', employeeLoans.employeeLoanByID);
};
