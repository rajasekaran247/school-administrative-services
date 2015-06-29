'use strict';

//Routes service used to communicate Routes REST endpoints
angular.module('routes').factory('Routes', ['$resource',
	function($resource) {
		return $resource('routes/:routeId', { routeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);