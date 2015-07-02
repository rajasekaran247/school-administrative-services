'use strict';

//Gate registers service used to communicate Gate registers REST endpoints
angular.module('gate-registers').factory('GateRegisters', ['$resource',
	function($resource) {
		return $resource('gate-registers/:gateRegisterId', { gateRegisterId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);