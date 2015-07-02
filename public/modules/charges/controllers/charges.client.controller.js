'use strict';

// Charges controller
angular.module('charges').controller('ChargesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Charges',
	function($scope, $stateParams, $location, Authentication, Charges) {
		$scope.authentication = Authentication;

		// Create new Charge
		$scope.create = function() {
			// Create new Charge object
			var charge = new Charges ({
				name: this.name
			});

			// Redirect after save
			charge.$save(function(response) {
				$location.path('charges/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Charge
		$scope.remove = function(charge) {
			if ( charge ) { 
				charge.$remove();

				for (var i in $scope.charges) {
					if ($scope.charges [i] === charge) {
						$scope.charges.splice(i, 1);
					}
				}
			} else {
				$scope.charge.$remove(function() {
					$location.path('charges');
				});
			}
		};

		// Update existing Charge
		$scope.update = function() {
			var charge = $scope.charge;

			charge.$update(function() {
				$location.path('charges/' + charge._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Charges
		$scope.find = function() {
			$scope.charges = Charges.query();
		};

		// Find existing Charge
		$scope.findOne = function() {
			$scope.charge = Charges.get({ 
				chargeId: $stateParams.chargeId
			});
		};
	}
]);