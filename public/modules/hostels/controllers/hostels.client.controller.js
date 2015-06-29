'use strict';

// Hostels controller
angular.module('hostels').controller('HostelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Hostels',
	function($scope, $stateParams, $location, Authentication, Hostels) {
		$scope.authentication = Authentication;

		// Create new Hostel
		$scope.create = function() {
			// Create new Hostel object
			var hostel = new Hostels ({
				name: this.name
			});

			// Redirect after save
			hostel.$save(function(response) {
				$location.path('hostels/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Hostel
		$scope.remove = function(hostel) {
			if ( hostel ) { 
				hostel.$remove();

				for (var i in $scope.hostels) {
					if ($scope.hostels [i] === hostel) {
						$scope.hostels.splice(i, 1);
					}
				}
			} else {
				$scope.hostel.$remove(function() {
					$location.path('hostels');
				});
			}
		};

		// Update existing Hostel
		$scope.update = function() {
			var hostel = $scope.hostel;

			hostel.$update(function() {
				$location.path('hostels/' + hostel._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Hostels
		$scope.find = function() {
			$scope.hostels = Hostels.query();
		};

		// Find existing Hostel
		$scope.findOne = function() {
			$scope.hostel = Hostels.get({ 
				hostelId: $stateParams.hostelId
			});
		};
	}
]);