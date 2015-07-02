'use strict';

//Setting up route
angular.module('payrolls').config(['$stateProvider',
	function($stateProvider) {
		// Payrolls state routing
		$stateProvider.
		state('listPayrolls', {
			url: '/payrolls',
			templateUrl: 'modules/payrolls/views/list-payrolls.client.view.html'
		}).
		state('createPayroll', {
			url: '/payrolls/create',
			templateUrl: 'modules/payrolls/views/create-payroll.client.view.html'
		}).
		state('viewPayroll', {
			url: '/payrolls/:payrollId',
			templateUrl: 'modules/payrolls/views/view-payroll.client.view.html'
		}).
		state('editPayroll', {
			url: '/payrolls/:payrollId/edit',
			templateUrl: 'modules/payrolls/views/edit-payroll.client.view.html'
		});
	}
]);