'use strict';

//Hostel rooms service used to communicate Hostel rooms REST endpoints
angular.module('hostel-rooms').factory('HostelRooms', ['$resource',
	function($resource) {
		return $resource('hostel-rooms/:hostelRoomId', { hostelRoomId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);