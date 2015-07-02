'use strict';

//Libraries service used to communicate Libraries REST endpoints
angular.module('libraries').factory('Libraries', ['$resource',
	function($resource) {
		return $resource('libraries/:libraryId', { libraryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);