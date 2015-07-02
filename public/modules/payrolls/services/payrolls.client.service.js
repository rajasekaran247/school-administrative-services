'use strict';

//Payrolls service used to communicate Payrolls REST endpoints
angular.module('payrolls').factory('Payrolls', ['$resource',
	function($resource) {
		return $resource('payrolls/:payrollId', { payrollId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);