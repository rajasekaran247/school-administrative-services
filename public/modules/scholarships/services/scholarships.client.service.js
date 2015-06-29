'use strict';

//Scholarships service used to communicate Scholarships REST endpoints
angular.module('scholarships').factory('Scholarships', ['$resource',
	function($resource) {
		return $resource('scholarships/:scholarshipId', { scholarshipId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);