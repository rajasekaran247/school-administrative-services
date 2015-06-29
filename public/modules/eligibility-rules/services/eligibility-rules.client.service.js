'use strict';

//Eligibility rules service used to communicate Eligibility rules REST endpoints
angular.module('eligibility-rules').factory('EligibilityRules', ['$resource',
	function($resource) {
		return $resource('eligibility-rules/:eligibilityRuleId', { eligibilityRuleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);