'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var eligibilityRules = require('../../app/controllers/eligibility-rules.server.controller');

	// Eligibility rules Routes
	app.route('/eligibility-rules')
		.get(eligibilityRules.list)
		.post(users.requiresLogin, eligibilityRules.create);

	app.route('/eligibility-rules/:eligibilityRuleId')
		.get(eligibilityRules.read)
		.put(users.requiresLogin, eligibilityRules.hasAuthorization, eligibilityRules.update)
		.delete(users.requiresLogin, eligibilityRules.hasAuthorization, eligibilityRules.delete);

	// Finish by binding the Eligibility rule middleware
	app.param('eligibilityRuleId', eligibilityRules.eligibilityRuleByID);
};
