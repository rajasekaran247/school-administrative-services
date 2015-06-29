'use strict';

//Setting up route
angular.module('catalogs').config(['$stateProvider',
	function($stateProvider) {
		// Catalogs state routing
		$stateProvider.
		state('listCatalogs', {
			url: '/catalogs',
			templateUrl: 'modules/catalogs/views/list-catalogs.client.view.html'
		}).
		state('createCatalog', {
			url: '/catalogs/create',
			templateUrl: 'modules/catalogs/views/create-catalog.client.view.html'
		}).
		state('viewCatalog', {
			url: '/catalogs/:catalogId',
			templateUrl: 'modules/catalogs/views/view-catalog.client.view.html'
		}).
		state('editCatalog', {
			url: '/catalogs/:catalogId/edit',
			templateUrl: 'modules/catalogs/views/edit-catalog.client.view.html'
		});
	}
]);