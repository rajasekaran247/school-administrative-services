'use strict';

//Setting up route
angular.module('hostel-allotments').config(['$stateProvider',
	function($stateProvider) {
		// Hostel allotments state routing
		$stateProvider.
		state('listHostelAllotments', {
			url: '/hostel-allotments',
			templateUrl: 'modules/hostel-allotments/views/list-hostel-allotments.client.view.html'
		}).
		state('createHostelAllotment', {
			url: '/hostel-allotments/create',
			templateUrl: 'modules/hostel-allotments/views/create-hostel-allotment.client.view.html'
		}).
		state('viewHostelAllotment', {
			url: '/hostel-allotments/:hostelAllotmentId',
			templateUrl: 'modules/hostel-allotments/views/view-hostel-allotment.client.view.html'
		}).
		state('editHostelAllotment', {
			url: '/hostel-allotments/:hostelAllotmentId/edit',
			templateUrl: 'modules/hostel-allotments/views/edit-hostel-allotment.client.view.html'
		});
	}
]);