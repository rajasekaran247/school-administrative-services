'use strict';

//Setting up route
angular.module('gate-registers').config(['$stateProvider',
	function($stateProvider) {
		// Gate registers state routing
		$stateProvider.
		state('listGateRegisters', {
			url: '/gate-registers',
			templateUrl: 'modules/gate-registers/views/list-gate-registers.client.view.html'
		}).
		state('createGateRegister', {
			url: '/gate-registers/create',
			templateUrl: 'modules/gate-registers/views/create-gate-register.client.view.html'
		}).
		state('viewGateRegister', {
			url: '/gate-registers/:gateRegisterId',
			templateUrl: 'modules/gate-registers/views/view-gate-register.client.view.html'
		}).
		state('editGateRegister', {
			url: '/gate-registers/:gateRegisterId/edit',
			templateUrl: 'modules/gate-registers/views/edit-gate-register.client.view.html'
		});
	}
]);