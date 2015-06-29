'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var employeePayrolls = require('../../app/controllers/employee-payrolls.server.controller');

	// Employee payrolls Routes
	app.route('/employee-payrolls')
		.get(employeePayrolls.list)
		.post(users.requiresLogin, employeePayrolls.create);

	app.route('/employee-payrolls/:employeePayrollId')
		.get(employeePayrolls.read)
		.put(users.requiresLogin, employeePayrolls.hasAuthorization, employeePayrolls.update)
		.delete(users.requiresLogin, employeePayrolls.hasAuthorization, employeePayrolls.delete);

	// Finish by binding the Employee payroll middleware
	app.param('employeePayrollId', employeePayrolls.employeePayrollByID);
};
