'use strict';

//Setting up route
angular.module('routes').config(['$stateProvider',
	function($stateProvider) {
		// Routes state routing
		$stateProvider.
		state('listRoutes', {
			url: '/routes',
			templateUrl: 'modules/routes/views/list-routes.client.view.html'
		}).
		state('createRoute', {
			url: '/routes/create',
			templateUrl: 'modules/routes/views/create-route.client.view.html'
		}).
		state('viewRoute', {
			url: '/routes/:routeId',
			templateUrl: 'modules/routes/views/view-route.client.view.html'
		}).
		state('editRoute', {
			url: '/routes/:routeId/edit',
			templateUrl: 'modules/routes/views/edit-route.client.view.html'
		});
	}
]);