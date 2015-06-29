'use strict';

//Employee payrolls service used to communicate Employee payrolls REST endpoints
angular.module('employee-payrolls').factory('EmployeePayrolls', ['$resource',
	function($resource) {
		return $resource('employee-payrolls/:employeePayrollId', { employeePayrollId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);