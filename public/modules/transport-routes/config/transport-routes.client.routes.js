'use strict';

//Setting up route
angular.module('transport-routes').config(['$stateProvider',
	function($stateProvider) {
		// Transport routes state routing
		$stateProvider.
		state('listTransportRoutes', {
			url: '/transport-routes',
			templateUrl: 'modules/transport-routes/views/list-transport-routes.client.view.html'
		}).
		state('createTransportRoute', {
			url: '/transport-routes/create',
			templateUrl: 'modules/transport-routes/views/create-transport-route.client.view.html'
		}).
		state('viewTransportRoute', {
			url: '/transport-routes/:transportRouteId',
			templateUrl: 'modules/transport-routes/views/view-transport-route.client.view.html'
		}).
		state('editTransportRoute', {
			url: '/transport-routes/:transportRouteId/edit',
			templateUrl: 'modules/transport-routes/views/edit-transport-route.client.view.html'
		});
	}
]);