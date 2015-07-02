'use strict';

//Library members service used to communicate Library members REST endpoints
angular.module('library-members').factory('LibraryMembers', ['$resource',
	function($resource) {
		return $resource('library-members/:libraryMemberId', { libraryMemberId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);