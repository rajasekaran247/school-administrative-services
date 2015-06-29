'use strict';

//Setting up route
angular.module('admission-eligibility-rules').config(['$stateProvider',
	function($stateProvider) {
		// Admission eligibility rules state routing
		$stateProvider.
		state('listAdmissionEligibilityRules', {
			url: '/admission-eligibility-rules',
			templateUrl: 'modules/admission-eligibility-rules/views/list-admission-eligibility-rules.client.view.html'
		}).
		state('createAdmissionEligibilityRule', {
			url: '/admission-eligibility-rules/create',
			templateUrl: 'modules/admission-eligibility-rules/views/create-admission-eligibility-rule.client.view.html'
		}).
		state('viewAdmissionEligibilityRule', {
			url: '/admission-eligibility-rules/:admissionEligibilityRuleId',
			templateUrl: 'modules/admission-eligibility-rules/views/view-admission-eligibility-rule.client.view.html'
		}).
		state('editAdmissionEligibilityRule', {
			url: '/admission-eligibility-rules/:admissionEligibilityRuleId/edit',
			templateUrl: 'modules/admission-eligibility-rules/views/edit-admission-eligibility-rule.client.view.html'
		});
	}
]);