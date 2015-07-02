'use strict';

//Setting up route
angular.module('allotments').config(['$stateProvider',
	function($stateProvider) {
		// Allotments state routing
		$stateProvider.
		state('listAllotments', {
			url: '/allotments',
			templateUrl: 'modules/allotments/views/list-allotments.client.view.html'
		}).
		state('createAllotment', {
			url: '/allotments/create',
			templateUrl: 'modules/allotments/views/create-allotment.client.view.html'
		}).
		state('viewAllotment', {
			url: '/allotments/:allotmentId',
			templateUrl: 'modules/allotments/views/view-allotment.client.view.html'
		}).
		state('editAllotment', {
			url: '/allotments/:allotmentId/edit',
			templateUrl: 'modules/allotments/views/edit-allotment.client.view.html'
		});
	}
]);