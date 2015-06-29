'use strict';

//Employee loans service used to communicate Employee loans REST endpoints
angular.module('employee-loans').factory('EmployeeLoans', ['$resource',
	function($resource) {
		return $resource('employee-loans/:employeeLoanId', { employeeLoanId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);