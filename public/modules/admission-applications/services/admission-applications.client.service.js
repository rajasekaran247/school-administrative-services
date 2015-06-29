'use strict';

//Admission applications service used to communicate Admission applications REST endpoints
angular.module('admission-applications').factory('AdmissionApplications', ['$resource',
	function($resource) {
		return $resource('admission-applications/:admissionApplicationId', { admissionApplicationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);