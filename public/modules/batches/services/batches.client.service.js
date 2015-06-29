'use strict';

//Batches service used to communicate Batches REST endpoints
angular.module('batches').factory('Batches', ['$resource',
	function($resource) {
		return $resource('batches/:batchId', { batchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);