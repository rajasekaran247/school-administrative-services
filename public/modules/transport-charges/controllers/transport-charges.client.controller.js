'use strict';

// Transport charges controller
angular.module('transport-charges').controller('TransportChargesController', ['$scope', '$stateParams', '$location', 'Authentication', 'TransportCharges',
	function($scope, $stateParams, $location, Authentication, TransportCharges) {
		$scope.authentication = Authentication;

		// Create new Transport charge
		$scope.create = function() {
			// Create new Transport charge object
			var transportCharge = new TransportCharges ({
				name: this.name
			});

			// Redirect after save
			transportCharge.$save(function(response) {
				$location.path('transport-charges/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Transport charge
		$scope.remove = function(transportCharge) {
			if ( transportCharge ) { 
				transportCharge.$remove();

				for (var i in $scope.transportCharges) {
					if ($scope.transportCharges [i] === transportCharge) {
						$scope.transportCharges.splice(i, 1);
					}
				}
			} else {
				$scope.transportCharge.$remove(function() {
					$location.path('transport-charges');
				});
			}
		};

		// Update existing Transport charge
		$scope.update = function() {
			var transportCharge = $scope.transportCharge;

			transportCharge.$update(function() {
				$location.path('transport-charges/' + transportCharge._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Transport charges
		$scope.find = function() {
			$scope.transportCharges = TransportCharges.query();
		};

		// Find existing Transport charge
		$scope.findOne = function() {
			$scope.transportCharge = TransportCharges.get({ 
				transportChargeId: $stateParams.transportChargeId
			});
		};
	}
]);