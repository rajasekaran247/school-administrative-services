'use strict';

// Payrolls controller
angular.module('payrolls').controller('PayrollsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Payrolls',
	function($scope, $stateParams, $location, Authentication, Payrolls) {
		$scope.authentication = Authentication;

		// Create new Payroll
		$scope.create = function() {
			// Create new Payroll object
			var payroll = new Payrolls ({
				name: this.name
			});

			// Redirect after save
			payroll.$save(function(response) {
				$location.path('payrolls/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Payroll
		$scope.remove = function(payroll) {
			if ( payroll ) { 
				payroll.$remove();

				for (var i in $scope.payrolls) {
					if ($scope.payrolls [i] === payroll) {
						$scope.payrolls.splice(i, 1);
					}
				}
			} else {
				$scope.payroll.$remove(function() {
					$location.path('payrolls');
				});
			}
		};

		// Update existing Payroll
		$scope.update = function() {
			var payroll = $scope.payroll;

			payroll.$update(function() {
				$location.path('payrolls/' + payroll._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Payrolls
		$scope.find = function() {
			$scope.payrolls = Payrolls.query();
		};

		// Find existing Payroll
		$scope.findOne = function() {
			$scope.payroll = Payrolls.get({ 
				payrollId: $stateParams.payrollId
			});
		};
	}
]);