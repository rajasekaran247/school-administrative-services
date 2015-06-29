'use strict';

//Vehicle logs service used to communicate Vehicle logs REST endpoints
angular.module('vehicle-logs').factory('VehicleLogs', ['$resource',
	function($resource) {
		return $resource('vehicle-logs/:vehicleLogId', { vehicleLogId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);