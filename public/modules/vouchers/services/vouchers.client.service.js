'use strict';

//Vouchers service used to communicate Vouchers REST endpoints
angular.module('vouchers').factory('Vouchers', ['$resource',
	function($resource) {
		return $resource('vouchers/:voucherId', { voucherId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);