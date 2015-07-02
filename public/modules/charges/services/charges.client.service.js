'use strict';

//Charges service used to communicate Charges REST endpoints
angular.module('charges').factory('Charges', ['$resource',
	function($resource) {
		return $resource('charges/:chargeId', { chargeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);