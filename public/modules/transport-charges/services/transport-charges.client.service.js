'use strict';

//Transport charges service used to communicate Transport charges REST endpoints
angular.module('transport-charges').factory('TransportCharges', ['$resource',
	function($resource) {
		return $resource('transport-charges/:transportChargeId', { transportChargeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);