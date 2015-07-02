'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateRegisters = require('../../app/controllers/gate-registers.server.controller');

	// Gate registers Routes
	app.route('/gate-registers')
		.get(gateRegisters.list)
		.post(users.requiresLogin, gateRegisters.create);

	app.route('/gate-registers/:gateRegisterId')
		.get(gateRegisters.read)
		.put(users.requiresLogin, gateRegisters.hasAuthorization, gateRegisters.update)
		.delete(users.requiresLogin, gateRegisters.hasAuthorization, gateRegisters.delete);

	// Finish by binding the Gate register middleware
	app.param('gateRegisterId', gateRegisters.gateRegisterByID);
};
