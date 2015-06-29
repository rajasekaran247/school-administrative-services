'use strict';

// Hostel allotments controller
angular.module('hostel-allotments').controller('HostelAllotmentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'HostelAllotments',
	function($scope, $stateParams, $location, Authentication, HostelAllotments) {
		$scope.authentication = Authentication;

		// Create new Hostel allotment
		$scope.create = function() {
			// Create new Hostel allotment object
			var hostelAllotment = new HostelAllotments ({
				name: this.name
			});

			// Redirect after save
			hostelAllotment.$save(function(response) {
				$location.path('hostel-allotments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Hostel allotment
		$scope.remove = function(hostelAllotment) {
			if ( hostelAllotment ) { 
				hostelAllotment.$remove();

				for (var i in $scope.hostelAllotments) {
					if ($scope.hostelAllotments [i] === hostelAllotment) {
						$scope.hostelAllotments.splice(i, 1);
					}
				}
			} else {
				$scope.hostelAllotment.$remove(function() {
					$location.path('hostel-allotments');
				});
			}
		};

		// Update existing Hostel allotment
		$scope.update = function() {
			var hostelAllotment = $scope.hostelAllotment;

			hostelAllotment.$update(function() {
				$location.path('hostel-allotments/' + hostelAllotment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Hostel allotments
		$scope.find = function() {
			$scope.hostelAllotments = HostelAllotments.query();
		};

		// Find existing Hostel allotment
		$scope.findOne = function() {
			$scope.hostelAllotment = HostelAllotments.get({ 
				hostelAllotmentId: $stateParams.hostelAllotmentId
			});
		};
	}
]);