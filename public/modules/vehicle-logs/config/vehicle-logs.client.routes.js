'use strict';

//Setting up route
angular.module('vehicle-logs').config(['$stateProvider',
	function($stateProvider) {
		// Vehicle logs state routing
		$stateProvider.
		state('listVehicleLogs', {
			url: '/vehicle-logs',
			templateUrl: 'modules/vehicle-logs/views/list-vehicle-logs.client.view.html'
		}).
		state('createVehicleLog', {
			url: '/vehicle-logs/create',
			templateUrl: 'modules/vehicle-logs/views/create-vehicle-log.client.view.html'
		}).
		state('viewVehicleLog', {
			url: '/vehicle-logs/:vehicleLogId',
			templateUrl: 'modules/vehicle-logs/views/view-vehicle-log.client.view.html'
		}).
		state('editVehicleLog', {
			url: '/vehicle-logs/:vehicleLogId/edit',
			templateUrl: 'modules/vehicle-logs/views/edit-vehicle-log.client.view.html'
		});
	}
]);