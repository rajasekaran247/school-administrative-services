'use strict';

//Setting up route
angular.module('hostel-rooms').config(['$stateProvider',
	function($stateProvider) {
		// Hostel rooms state routing
		$stateProvider.
		state('listHostelRooms', {
			url: '/hostel-rooms',
			templateUrl: 'modules/hostel-rooms/views/list-hostel-rooms.client.view.html'
		}).
		state('createHostelRoom', {
			url: '/hostel-rooms/create',
			templateUrl: 'modules/hostel-rooms/views/create-hostel-room.client.view.html'
		}).
		state('viewHostelRoom', {
			url: '/hostel-rooms/:hostelRoomId',
			templateUrl: 'modules/hostel-rooms/views/view-hostel-room.client.view.html'
		}).
		state('editHostelRoom', {
			url: '/hostel-rooms/:hostelRoomId/edit',
			templateUrl: 'modules/hostel-rooms/views/edit-hostel-room.client.view.html'
		});
	}
]);