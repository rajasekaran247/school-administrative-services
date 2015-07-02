'use strict';

//Setting up route
angular.module('libraries').config(['$stateProvider',
	function($stateProvider) {
		// Libraries state routing
		$stateProvider.
		state('listLibraries', {
			url: '/libraries',
			templateUrl: 'modules/libraries/views/list-libraries.client.view.html'
		}).
		state('createLibrary', {
			url: '/libraries/create',
			templateUrl: 'modules/libraries/views/create-library.client.view.html'
		}).
		state('viewLibrary', {
			url: '/libraries/:libraryId',
			templateUrl: 'modules/libraries/views/view-library.client.view.html'
		}).
		state('editLibrary', {
			url: '/libraries/:libraryId/edit',
			templateUrl: 'modules/libraries/views/edit-library.client.view.html'
		});
	}
]);