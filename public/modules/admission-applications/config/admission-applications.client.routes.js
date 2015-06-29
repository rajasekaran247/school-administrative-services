'use strict';

//Setting up route
angular.module('admission-applications').config(['$stateProvider',
	function($stateProvider) {
		// Admission applications state routing
		$stateProvider.
		state('listAdmissionApplications', {
			url: '/admission-applications',
			templateUrl: 'modules/admission-applications/views/list-admission-applications.client.view.html'
		}).
		state('createAdmissionApplication', {
			url: '/admission-applications/create',
			templateUrl: 'modules/admission-applications/views/create-admission-application.client.view.html'
		}).
		state('viewAdmissionApplication', {
			url: '/admission-applications/:admissionApplicationId',
			templateUrl: 'modules/admission-applications/views/view-admission-application.client.view.html'
		}).
		state('editAdmissionApplication', {
			url: '/admission-applications/:admissionApplicationId/edit',
			templateUrl: 'modules/admission-applications/views/edit-admission-application.client.view.html'
		});
	}
]);