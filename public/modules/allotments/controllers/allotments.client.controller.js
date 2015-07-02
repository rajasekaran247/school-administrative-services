'use strict';

// Allotments controller
angular.module('allotments').controller('AllotmentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Allotments',
	function($scope, $stateParams, $location, Authentication, Allotments) {
		$scope.authentication = Authentication;

		// Create new Allotment
		$scope.create = function() {
			// Create new Allotment object
			var allotment = new Allotments ({
				name: this.name
			});

			// Redirect after save
			allotment.$save(function(response) {
				$location.path('allotments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Allotment
		$scope.remove = function(allotment) {
			if ( allotment ) { 
				allotment.$remove();

				for (var i in $scope.allotments) {
					if ($scope.allotments [i] === allotment) {
						$scope.allotments.splice(i, 1);
					}
				}
			} else {
				$scope.allotment.$remove(function() {
					$location.path('allotments');
				});
			}
		};

		// Update existing Allotment
		$scope.update = function() {
			var allotment = $scope.allotment;

			allotment.$update(function() {
				$location.path('allotments/' + allotment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Allotments
		$scope.find = function() {
			$scope.allotments = Allotments.query();
		};

		// Find existing Allotment
		$scope.findOne = function() {
			$scope.allotment = Allotments.get({ 
				allotmentId: $stateParams.allotmentId
			});
		};
	}
]);