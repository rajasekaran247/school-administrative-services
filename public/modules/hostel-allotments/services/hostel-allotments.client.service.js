'use strict';

//Hostel allotments service used to communicate Hostel allotments REST endpoints
angular.module('hostel-allotments').factory('HostelAllotments', ['$resource',
	function($resource) {
		return $resource('hostel-allotments/:hostelAllotmentId', { hostelAllotmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);