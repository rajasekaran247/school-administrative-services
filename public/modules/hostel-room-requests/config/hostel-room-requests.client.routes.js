'use strict';

//Setting up route
angular.module('hostel-room-requests').config(['$stateProvider',
	function($stateProvider) {
		// Hostel room requests state routing
		$stateProvider.
		state('listHostelRoomRequests', {
			url: '/hostel-room-requests',
			templateUrl: 'modules/hostel-room-requests/views/list-hostel-room-requests.client.view.html'
		}).
		state('createHostelRoomRequest', {
			url: '/hostel-room-requests/create',
			templateUrl: 'modules/hostel-room-requests/views/create-hostel-room-request.client.view.html'
		}).
		state('viewHostelRoomRequest', {
			url: '/hostel-room-requests/:hostelRoomRequestId',
			templateUrl: 'modules/hostel-room-requests/views/view-hostel-room-request.client.view.html'
		}).
		state('editHostelRoomRequest', {
			url: '/hostel-room-requests/:hostelRoomRequestId/edit',
			templateUrl: 'modules/hostel-room-requests/views/edit-hostel-room-request.client.view.html'
		});
	}
]);