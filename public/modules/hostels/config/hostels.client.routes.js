'use strict';

//Setting up route
angular.module('hostels').config(['$stateProvider',
	function($stateProvider) {
		// Hostels state routing
		$stateProvider.
		state('listHostels', {
			url: '/hostels',
			templateUrl: 'modules/hostels/views/list-hostels.client.view.html'
		}).
		state('createHostel', {
			url: '/hostels/create',
			templateUrl: 'modules/hostels/views/create-hostel.client.view.html'
		}).
		state('viewHostel', {
			url: '/hostels/:hostelId',
			templateUrl: 'modules/hostels/views/view-hostel.client.view.html'
		}).
		state('editHostel', {
			url: '/hostels/:hostelId/edit',
			templateUrl: 'modules/hostels/views/edit-hostel.client.view.html'
		});
	}
]);