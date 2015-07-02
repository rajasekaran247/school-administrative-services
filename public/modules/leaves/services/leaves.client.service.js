'use strict';

//Leaves service used to communicate Leaves REST endpoints
angular.module('leaves').factory('Leaves', ['$resource',
	function($resource) {
		return $resource('leaves/:leaveId', { leaveId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);