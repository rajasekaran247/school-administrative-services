'use strict';

// Scholarships controller
angular.module('scholarships').controller('ScholarshipsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Scholarships',
	function($scope, $stateParams, $location, Authentication, Scholarships) {
		$scope.authentication = Authentication;

		// Create new Scholarship
		$scope.create = function() {
			// Create new Scholarship object
			var scholarship = new Scholarships ({
				name: this.name
			});

			// Redirect after save
			scholarship.$save(function(response) {
				$location.path('scholarships/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Scholarship
		$scope.remove = function(scholarship) {
			if ( scholarship ) { 
				scholarship.$remove();

				for (var i in $scope.scholarships) {
					if ($scope.scholarships [i] === scholarship) {
						$scope.scholarships.splice(i, 1);
					}
				}
			} else {
				$scope.scholarship.$remove(function() {
					$location.path('scholarships');
				});
			}
		};

		// Update existing Scholarship
		$scope.update = function() {
			var scholarship = $scope.scholarship;

			scholarship.$update(function() {
				$location.path('scholarships/' + scholarship._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Scholarships
		$scope.find = function() {
			$scope.scholarships = Scholarships.query();
		};

		// Find existing Scholarship
		$scope.findOne = function() {
			$scope.scholarship = Scholarships.get({ 
				scholarshipId: $stateParams.scholarshipId
			});
		};
	}
]);