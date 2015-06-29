'use strict';

//Setting up route
angular.module('scholarships').config(['$stateProvider',
	function($stateProvider) {
		// Scholarships state routing
		$stateProvider.
		state('listScholarships', {
			url: '/scholarships',
			templateUrl: 'modules/scholarships/views/list-scholarships.client.view.html'
		}).
		state('createScholarship', {
			url: '/scholarships/create',
			templateUrl: 'modules/scholarships/views/create-scholarship.client.view.html'
		}).
		state('viewScholarship', {
			url: '/scholarships/:scholarshipId',
			templateUrl: 'modules/scholarships/views/view-scholarship.client.view.html'
		}).
		state('editScholarship', {
			url: '/scholarships/:scholarshipId/edit',
			templateUrl: 'modules/scholarships/views/edit-scholarship.client.view.html'
		});
	}
]);