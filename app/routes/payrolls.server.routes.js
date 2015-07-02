'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var payrolls = require('../../app/controllers/payrolls.server.controller');

	// Payrolls Routes
	app.route('/payrolls')
		.get(payrolls.list)
		.post(users.requiresLogin, payrolls.create);

	app.route('/payrolls/:payrollId')
		.get(payrolls.read)
		.put(users.requiresLogin, payrolls.hasAuthorization, payrolls.update)
		.delete(users.requiresLogin, payrolls.hasAuthorization, payrolls.delete);

	// Finish by binding the Payroll middleware
	app.param('payrollId', payrolls.payrollByID);
};
