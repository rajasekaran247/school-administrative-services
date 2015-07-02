'use strict';

// Room requests controller
angular.module('room-requests').controller('RoomRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'RoomRequests',
	function($scope, $stateParams, $location, Authentication, RoomRequests) {
		$scope.authentication = Authentication;

		// Create new Room request
		$scope.create = function() {
			// Create new Room request object
			var roomRequest = new RoomRequests ({
				name: this.name
			});

			// Redirect after save
			roomRequest.$save(function(response) {
				$location.path('room-requests/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Room request
		$scope.remove = function(roomRequest) {
			if ( roomRequest ) { 
				roomRequest.$remove();

				for (var i in $scope.roomRequests) {
					if ($scope.roomRequests [i] === roomRequest) {
						$scope.roomRequests.splice(i, 1);
					}
				}
			} else {
				$scope.roomRequest.$remove(function() {
					$location.path('room-requests');
				});
			}
		};

		// Update existing Room request
		$scope.update = function() {
			var roomRequest = $scope.roomRequest;

			roomRequest.$update(function() {
				$location.path('room-requests/' + roomRequest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Room requests
		$scope.find = function() {
			$scope.roomRequests = RoomRequests.query();
		};

		// Find existing Room request
		$scope.findOne = function() {
			$scope.roomRequest = RoomRequests.get({ 
				roomRequestId: $stateParams.roomRequestId
			});
		};
	}
]);