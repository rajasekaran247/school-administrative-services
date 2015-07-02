'use strict';

// Leaves controller
angular.module('leaves').controller('LeavesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Leaves',
	function($scope, $stateParams, $location, Authentication, Leaves) {
		$scope.authentication = Authentication;

		// Create new Leave
		$scope.create = function() {
			// Create new Leave object
			var leave = new Leaves ({
				name: this.name
			});

			// Redirect after save
			leave.$save(function(response) {
				$location.path('leaves/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Leave
		$scope.remove = function(leave) {
			if ( leave ) { 
				leave.$remove();

				for (var i in $scope.leaves) {
					if ($scope.leaves [i] === leave) {
						$scope.leaves.splice(i, 1);
					}
				}
			} else {
				$scope.leave.$remove(function() {
					$location.path('leaves');
				});
			}
		};

		// Update existing Leave
		$scope.update = function() {
			var leave = $scope.leave;

			leave.$update(function() {
				$location.path('leaves/' + leave._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Leaves
		$scope.find = function() {
			$scope.leaves = Leaves.query();
		};

		// Find existing Leave
		$scope.findOne = function() {
			$scope.leave = Leaves.get({ 
				leaveId: $stateParams.leaveId
			});
		};
	}
]);