'use strict';

//Setting up route
angular.module('leaves').config(['$stateProvider',
	function($stateProvider) {
		// Leaves state routing
		$stateProvider.
		state('listLeaves', {
			url: '/leaves',
			templateUrl: 'modules/leaves/views/list-leaves.client.view.html'
		}).
		state('createLeave', {
			url: '/leaves/create',
			templateUrl: 'modules/leaves/views/create-leave.client.view.html'
		}).
		state('viewLeave', {
			url: '/leaves/:leaveId',
			templateUrl: 'modules/leaves/views/view-leave.client.view.html'
		}).
		state('editLeave', {
			url: '/leaves/:leaveId/edit',
			templateUrl: 'modules/leaves/views/edit-leave.client.view.html'
		});
	}
]);