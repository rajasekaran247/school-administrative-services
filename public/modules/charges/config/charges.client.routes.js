'use strict';

//Setting up route
angular.module('charges').config(['$stateProvider',
	function($stateProvider) {
		// Charges state routing
		$stateProvider.
		state('listCharges', {
			url: '/charges',
			templateUrl: 'modules/charges/views/list-charges.client.view.html'
		}).
		state('createCharge', {
			url: '/charges/create',
			templateUrl: 'modules/charges/views/create-charge.client.view.html'
		}).
		state('viewCharge', {
			url: '/charges/:chargeId',
			templateUrl: 'modules/charges/views/view-charge.client.view.html'
		}).
		state('editCharge', {
			url: '/charges/:chargeId/edit',
			templateUrl: 'modules/charges/views/edit-charge.client.view.html'
		});
	}
]);