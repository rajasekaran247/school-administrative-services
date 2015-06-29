'use strict';

// Hostel rooms controller
angular.module('hostel-rooms').controller('HostelRoomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'HostelRooms',
	function($scope, $stateParams, $location, Authentication, HostelRooms) {
		$scope.authentication = Authentication;

		// Create new Hostel room
		$scope.create = function() {
			// Create new Hostel room object
			var hostelRoom = new HostelRooms ({
				name: this.name
			});

			// Redirect after save
			hostelRoom.$save(function(response) {
				$location.path('hostel-rooms/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Hostel room
		$scope.remove = function(hostelRoom) {
			if ( hostelRoom ) { 
				hostelRoom.$remove();

				for (var i in $scope.hostelRooms) {
					if ($scope.hostelRooms [i] === hostelRoom) {
						$scope.hostelRooms.splice(i, 1);
					}
				}
			} else {
				$scope.hostelRoom.$remove(function() {
					$location.path('hostel-rooms');
				});
			}
		};

		// Update existing Hostel room
		$scope.update = function() {
			var hostelRoom = $scope.hostelRoom;

			hostelRoom.$update(function() {
				$location.path('hostel-rooms/' + hostelRoom._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Hostel rooms
		$scope.find = function() {
			$scope.hostelRooms = HostelRooms.query();
		};

		// Find existing Hostel room
		$scope.findOne = function() {
			$scope.hostelRoom = HostelRooms.get({ 
				hostelRoomId: $stateParams.hostelRoomId
			});
		};
	}
]);