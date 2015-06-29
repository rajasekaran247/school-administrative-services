'use strict';

//Employee leaves service used to communicate Employee leaves REST endpoints
angular.module('employee-leaves').factory('EmployeeLeaves', ['$resource',
	function($resource) {
		return $resource('employee-leaves/:employeeLeaveId', { employeeLeaveId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);