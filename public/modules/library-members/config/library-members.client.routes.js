'use strict';

//Setting up route
angular.module('library-members').config(['$stateProvider',
	function($stateProvider) {
		// Library members state routing
		$stateProvider.
		state('listLibraryMembers', {
			url: '/library-members',
			templateUrl: 'modules/library-members/views/list-library-members.client.view.html'
		}).
		state('createLibraryMember', {
			url: '/library-members/create',
			templateUrl: 'modules/library-members/views/create-library-member.client.view.html'
		}).
		state('viewLibraryMember', {
			url: '/library-members/:libraryMemberId',
			templateUrl: 'modules/library-members/views/view-library-member.client.view.html'
		}).
		state('editLibraryMember', {
			url: '/library-members/:libraryMemberId/edit',
			templateUrl: 'modules/library-members/views/edit-library-member.client.view.html'
		});
	}
]);