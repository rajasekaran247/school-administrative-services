'use strict';

//Setting up route
angular.module('eligibility-rules').config(['$stateProvider',
	function($stateProvider) {
		// Eligibility rules state routing
		$stateProvider.
		state('listEligibilityRules', {
			url: '/eligibility-rules',
			templateUrl: 'modules/eligibility-rules/views/list-eligibility-rules.client.view.html'
		}).
		state('createEligibilityRule', {
			url: '/eligibility-rules/create',
			templateUrl: 'modules/eligibility-rules/views/create-eligibility-rule.client.view.html'
		}).
		state('viewEligibilityRule', {
			url: '/eligibility-rules/:eligibilityRuleId',
			templateUrl: 'modules/eligibility-rules/views/view-eligibility-rule.client.view.html'
		}).
		state('editEligibilityRule', {
			url: '/eligibility-rules/:eligibilityRuleId/edit',
			templateUrl: 'modules/eligibility-rules/views/edit-eligibility-rule.client.view.html'
		});
	}
]);