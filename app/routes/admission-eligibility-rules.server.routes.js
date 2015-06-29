'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var admissionEligibilityRules = require('../../app/controllers/admission-eligibility-rules.server.controller');

	// Admission eligibility rules Routes
	app.route('/admission-eligibility-rules')
		.get(admissionEligibilityRules.list)
		.post(users.requiresLogin, admissionEligibilityRules.create);

	app.route('/admission-eligibility-rules/:admissionEligibilityRuleId')
		.get(admissionEligibilityRules.read)
		.put(users.requiresLogin, admissionEligibilityRules.hasAuthorization, admissionEligibilityRules.update)
		.delete(users.requiresLogin, admissionEligibilityRules.hasAuthorization, admissionEligibilityRules.delete);

	// Finish by binding the Admission eligibility rule middleware
	app.param('admissionEligibilityRuleId', admissionEligibilityRules.admissionEligibilityRuleByID);
};
