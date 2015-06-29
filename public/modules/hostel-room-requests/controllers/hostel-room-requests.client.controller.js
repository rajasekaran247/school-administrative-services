'use strict';

// Hostel room requests controller
angular.module('hostel-room-requests').controller('HostelRoomRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'HostelRoomRequests',
	function($scope, $stateParams, $location, Authentication, HostelRoomRequests) {
		$scope.authentication = Authentication;

		// Create new Hostel room request
		$scope.create = function() {
			// Create new Hostel room request object
			var hostelRoomRequest = new HostelRoomRequests ({
				name: this.name
			});

			// Redirect after save
			hostelRoomRequest.$save(function(response) {
				$location.path('hostel-room-requests/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Hostel room request
		$scope.remove = function(hostelRoomRequest) {
			if ( hostelRoomRequest ) { 
				hostelRoomRequest.$remove();

				for (var i in $scope.hostelRoomRequests) {
					if ($scope.hostelRoomRequests [i] === hostelRoomRequest) {
						$scope.hostelRoomRequests.splice(i, 1);
					}
				}
			} else {
				$scope.hostelRoomRequest.$remove(function() {
					$location.path('hostel-room-requests');
				});
			}
		};

		// Update existing Hostel room request
		$scope.update = function() {
			var hostelRoomRequest = $scope.hostelRoomRequest;

			hostelRoomRequest.$update(function() {
				$location.path('hostel-room-requests/' + hostelRoomRequest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Hostel room requests
		$scope.find = function() {
			$scope.hostelRoomRequests = HostelRoomRequests.query();
		};

		// Find existing Hostel room request
		$scope.findOne = function() {
			$scope.hostelRoomRequest = HostelRoomRequests.get({ 
				hostelRoomRequestId: $stateParams.hostelRoomRequestId
			});
		};
	}
]);