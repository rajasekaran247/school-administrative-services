'use strict';

// Vehicle logs controller
angular.module('vehicle-logs').controller('VehicleLogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'VehicleLogs',
	function($scope, $stateParams, $location, Authentication, VehicleLogs) {
		$scope.authentication = Authentication;

		// Create new Vehicle log
		$scope.create = function() {
			// Create new Vehicle log object
			var vehicleLog = new VehicleLogs ({
				weekStartingDate: this.weekStartingDate,
        vehicleNo: this.vehicleNo
			});

			// Redirect after save
			vehicleLog.$save(function(response) {
				$location.path('vehicle-logs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Vehicle log
		$scope.remove = function(vehicleLog) {
			if ( vehicleLog ) { 
				vehicleLog.$remove();

				for (var i in $scope.vehicleLogs) {
					if ($scope.vehicleLogs [i] === vehicleLog) {
						$scope.vehicleLogs.splice(i, 1);
					}
				}
			} else {
				$scope.vehicleLog.$remove(function() {
					$location.path('vehicle-logs');
				});
			}
		};

		// Update existing Vehicle log
		$scope.update = function() {
			var vehicleLog = $scope.vehicleLog;

			vehicleLog.$update(function() {
				$location.path('vehicle-logs/' + vehicleLog._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Vehicle logs
		$scope.find = function() {
			$scope.vehicleLogs = VehicleLogs.query();
		};

		// Find existing Vehicle log
		$scope.findOne = function() {
			$scope.vehicleLog = VehicleLogs.get({ 
				vehicleLogId: $stateParams.vehicleLogId
			});
		};
	}
]);