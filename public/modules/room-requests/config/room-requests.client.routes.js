'use strict';

//Setting up route
angular.module('room-requests').config(['$stateProvider',
	function($stateProvider) {
		// Room requests state routing
		$stateProvider.
		state('listRoomRequests', {
			url: '/room-requests',
			templateUrl: 'modules/room-requests/views/list-room-requests.client.view.html'
		}).
		state('createRoomRequest', {
			url: '/room-requests/create',
			templateUrl: 'modules/room-requests/views/create-room-request.client.view.html'
		}).
		state('viewRoomRequest', {
			url: '/room-requests/:roomRequestId',
			templateUrl: 'modules/room-requests/views/view-room-request.client.view.html'
		}).
		state('editRoomRequest', {
			url: '/room-requests/:roomRequestId/edit',
			templateUrl: 'modules/room-requests/views/edit-room-request.client.view.html'
		});
	}
]);