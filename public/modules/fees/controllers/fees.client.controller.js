'use strict';

// Fees controller
angular.module('fees').controller('FeesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Fees',
	function($scope, $stateParams, $location, Authentication, Fees) {
		$scope.authentication = Authentication;

		// Create new Fee
		$scope.create = function() {
			// Create new Fee object
			var fee = new Fees ({
				name: this.name
			});

			// Redirect after save
			fee.$save(function(response) {
				$location.path('fees/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Fee
		$scope.remove = function(fee) {
			if ( fee ) { 
				fee.$remove();

				for (var i in $scope.fees) {
					if ($scope.fees [i] === fee) {
						$scope.fees.splice(i, 1);
					}
				}
			} else {
				$scope.fee.$remove(function() {
					$location.path('fees');
				});
			}
		};

		// Update existing Fee
		$scope.update = function() {
			var fee = $scope.fee;

			fee.$update(function() {
				$location.path('fees/' + fee._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Fees
		$scope.find = function() {
			$scope.fees = Fees.query();
		};

		// Find existing Fee
		$scope.findOne = function() {
			$scope.fee = Fees.get({ 
				feeId: $stateParams.feeId
			});
		};
	}
]);