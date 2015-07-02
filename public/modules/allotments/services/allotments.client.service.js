'use strict';

//Allotments service used to communicate Allotments REST endpoints
angular.module('allotments').factory('Allotments', ['$resource',
	function($resource) {
		return $resource('allotments/:allotmentId', { allotmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);