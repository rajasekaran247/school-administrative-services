'use strict';

//Admission eligibility rules service used to communicate Admission eligibility rules REST endpoints
angular.module('admission-eligibility-rules').factory('AdmissionEligibilityRules', ['$resource',
	function($resource) {
		return $resource('admission-eligibility-rules/:admissionEligibilityRuleId', { admissionEligibilityRuleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);