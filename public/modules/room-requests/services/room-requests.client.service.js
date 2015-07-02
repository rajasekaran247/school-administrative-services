'use strict';

//Room requests service used to communicate Room requests REST endpoints
angular.module('room-requests').factory('RoomRequests', ['$resource',
	function($resource) {
		return $resource('room-requests/:roomRequestId', { roomRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);