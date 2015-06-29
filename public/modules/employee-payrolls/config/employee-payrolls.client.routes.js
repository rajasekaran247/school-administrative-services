'use strict';

//Setting up route
angular.module('employee-payrolls').config(['$stateProvider',
	function($stateProvider) {
		// Employee payrolls state routing
		$stateProvider.
		state('listEmployeePayrolls', {
			url: '/employee-payrolls',
			templateUrl: 'modules/employee-payrolls/views/list-employee-payrolls.client.view.html'
		}).
		state('createEmployeePayroll', {
			url: '/employee-payrolls/create',
			templateUrl: 'modules/employee-payrolls/views/create-employee-payroll.client.view.html'
		}).
		state('viewEmployeePayroll', {
			url: '/employee-payrolls/:employeePayrollId',
			templateUrl: 'modules/employee-payrolls/views/view-employee-payroll.client.view.html'
		}).
		state('editEmployeePayroll', {
			url: '/employee-payrolls/:employeePayrollId/edit',
			templateUrl: 'modules/employee-payrolls/views/edit-employee-payroll.client.view.html'
		});
	}
]);