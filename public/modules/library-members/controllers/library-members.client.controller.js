'use strict';

// Library members controller
angular.module('library-members').controller('LibraryMembersController', ['$scope', '$stateParams', '$location', 'Authentication', 'LibraryMembers',
	function($scope, $stateParams, $location, Authentication, LibraryMembers) {
		$scope.authentication = Authentication;

		// Create new Library member
		$scope.create = function() {
			// Create new Library member object
			var libraryMember = new LibraryMembers ({
				name: this.name
			});

			// Redirect after save
			libraryMember.$save(function(response) {
				$location.path('library-members/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Library member
		$scope.remove = function(libraryMember) {
			if ( libraryMember ) { 
				libraryMember.$remove();

				for (var i in $scope.libraryMembers) {
					if ($scope.libraryMembers [i] === libraryMember) {
						$scope.libraryMembers.splice(i, 1);
					}
				}
			} else {
				$scope.libraryMember.$remove(function() {
					$location.path('library-members');
				});
			}
		};

		// Update existing Library member
		$scope.update = function() {
			var libraryMember = $scope.libraryMember;

			libraryMember.$update(function() {
				$location.path('library-members/' + libraryMember._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Library members
		$scope.find = function() {
			$scope.libraryMembers = LibraryMembers.query();
		};

		// Find existing Library member
		$scope.findOne = function() {
			$scope.libraryMember = LibraryMembers.get({ 
				libraryMemberId: $stateParams.libraryMemberId
			});
		};
	}
]);