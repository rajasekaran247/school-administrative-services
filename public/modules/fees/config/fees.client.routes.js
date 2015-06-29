'use strict';

//Setting up route
angular.module('fees').config(['$stateProvider',
	function($stateProvider) {
		// Fees state routing
		$stateProvider.
		state('listFees', {
			url: '/fees',
			templateUrl: 'modules/fees/views/list-fees.client.view.html'
		}).
		state('createFee', {
			url: '/fees/create',
			templateUrl: 'modules/fees/views/create-fee.client.view.html'
		}).
		state('viewFee', {
			url: '/fees/:feeId',
			templateUrl: 'modules/fees/views/view-fee.client.view.html'
		}).
		state('editFee', {
			url: '/fees/:feeId/edit',
			templateUrl: 'modules/fees/views/edit-fee.client.view.html'
		});
	}
]);