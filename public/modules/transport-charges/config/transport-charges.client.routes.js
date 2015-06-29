'use strict';

//Setting up route
angular.module('transport-charges').config(['$stateProvider',
	function($stateProvider) {
		// Transport charges state routing
		$stateProvider.
		state('listTransportCharges', {
			url: '/transport-charges',
			templateUrl: 'modules/transport-charges/views/list-transport-charges.client.view.html'
		}).
		state('createTransportCharge', {
			url: '/transport-charges/create',
			templateUrl: 'modules/transport-charges/views/create-transport-charge.client.view.html'
		}).
		state('viewTransportCharge', {
			url: '/transport-charges/:transportChargeId',
			templateUrl: 'modules/transport-charges/views/view-transport-charge.client.view.html'
		}).
		state('editTransportCharge', {
			url: '/transport-charges/:transportChargeId/edit',
			templateUrl: 'modules/transport-charges/views/edit-transport-charge.client.view.html'
		});
	}
]);