'use strict';

//Fees service used to communicate Fees REST endpoints
angular.module('fees').factory('Fees', ['$resource',
	function($resource) {
		return $resource('fees/:feeId', { feeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);