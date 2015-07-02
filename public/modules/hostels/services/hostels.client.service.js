'use strict';

//Hostels service used to communicate Hostels REST endpoints
angular.module('hostels').factory('Hostels', ['$resource',
	function($resource) {
		return $resource('hostels/:hostelId', { hostelId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);