'use strict';

//Setting up route
angular.module('employee-leaves').config(['$stateProvider',
	function($stateProvider) {
		// Employee leaves state routing
		$stateProvider.
		state('listEmployeeLeaves', {
			url: '/employee-leaves',
			templateUrl: 'modules/employee-leaves/views/list-employee-leaves.client.view.html'
		}).
		state('createEmployeeLeave', {
			url: '/employee-leaves/create',
			templateUrl: 'modules/employee-leaves/views/create-employee-leave.client.view.html'
		}).
		state('viewEmployeeLeave', {
			url: '/employee-leaves/:employeeLeaveId',
			templateUrl: 'modules/employee-leaves/views/view-employee-leave.client.view.html'
		}).
		state('editEmployeeLeave', {
			url: '/employee-leaves/:employeeLeaveId/edit',
			templateUrl: 'modules/employee-leaves/views/edit-employee-leave.client.view.html'
		});
	}
]);