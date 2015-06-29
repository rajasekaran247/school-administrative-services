'use strict';

//Hostel room requests service used to communicate Hostel room requests REST endpoints
angular.module('hostel-room-requests').factory('HostelRoomRequests', ['$resource',
	function($resource) {
		return $resource('hostel-room-requests/:hostelRoomRequestId', { hostelRoomRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);