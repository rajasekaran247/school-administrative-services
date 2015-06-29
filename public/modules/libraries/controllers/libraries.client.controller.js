'use strict';

// Libraries controller
angular.module('libraries').controller('LibrariesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Libraries',
	function($scope, $stateParams, $location, Authentication, Libraries) {
		$scope.authentication = Authentication;

		// Create new Library
		$scope.create = function() {
			// Create new Library object
			var library = new Libraries ({
				name: this.name
			});

			// Redirect after save
			library.$save(function(response) {
				$location.path('libraries/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Library
		$scope.remove = function(library) {
			if ( library ) { 
				library.$remove();

				for (var i in $scope.libraries) {
					if ($scope.libraries [i] === library) {
						$scope.libraries.splice(i, 1);
					}
				}
			} else {
				$scope.library.$remove(function() {
					$location.path('libraries');
				});
			}
		};

		// Update existing Library
		$scope.update = function() {
			var library = $scope.library;

			library.$update(function() {
				$location.path('libraries/' + library._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Libraries
		$scope.find = function() {
			$scope.libraries = Libraries.query();
		};

		// Find existing Library
		$scope.findOne = function() {
			$scope.library = Libraries.get({ 
				libraryId: $stateParams.libraryId
			});
		};
	}
]);