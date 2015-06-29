'use strict';

//Catalogs service used to communicate Catalogs REST endpoints
angular.module('catalogs').factory('Catalogs', ['$resource',
	function($resource) {
		return $resource('catalogs/:catalogId', { catalogId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);