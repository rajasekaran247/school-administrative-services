'use strict';

//Transport routes service used to communicate Transport routes REST endpoints
angular.module('transport-routes').factory('TransportRoutes', ['$resource',
	function($resource) {
		return $resource('transport-routes/:transportRouteId', { transportRouteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);