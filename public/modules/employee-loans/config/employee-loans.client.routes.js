'use strict';

//Setting up route
angular.module('employee-loans').config(['$stateProvider',
	function($stateProvider) {
		// Employee loans state routing
		$stateProvider.
		state('listEmployeeLoans', {
			url: '/employee-loans',
			templateUrl: 'modules/employee-loans/views/list-employee-loans.client.view.html'
		}).
		state('createEmployeeLoan', {
			url: '/employee-loans/create',
			templateUrl: 'modules/employee-loans/views/create-employee-loan.client.view.html'
		}).
		state('viewEmployeeLoan', {
			url: '/employee-loans/:employeeLoanId',
			templateUrl: 'modules/employee-loans/views/view-employee-loan.client.view.html'
		}).
		state('editEmployeeLoan', {
			url: '/employee-loans/:employeeLoanId/edit',
			templateUrl: 'modules/employee-loans/views/edit-employee-loan.client.view.html'
		});
	}
]);