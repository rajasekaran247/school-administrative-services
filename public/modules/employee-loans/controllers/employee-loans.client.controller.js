'use strict';

// Employee loans controller
angular.module('employee-loans').controller('EmployeeLoansController', ['$scope', '$stateParams', '$location', 'Authentication', 'EmployeeLoans',
	function($scope, $stateParams, $location, Authentication, EmployeeLoans) {
		$scope.authentication = Authentication;

		// Create new Employee loan
		$scope.create = function() {
			// Create new Employee loan object
			var employeeLoan = new EmployeeLoans ({
				name: this.name
			});

			// Redirect after save
			employeeLoan.$save(function(response) {
				$location.path('employee-loans/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Employee loan
		$scope.remove = function(employeeLoan) {
			if ( employeeLoan ) { 
				employeeLoan.$remove();

				for (var i in $scope.employeeLoans) {
					if ($scope.employeeLoans [i] === employeeLoan) {
						$scope.employeeLoans.splice(i, 1);
					}
				}
			} else {
				$scope.employeeLoan.$remove(function() {
					$location.path('employee-loans');
				});
			}
		};

		// Update existing Employee loan
		$scope.update = function() {
			var employeeLoan = $scope.employeeLoan;

			employeeLoan.$update(function() {
				$location.path('employee-loans/' + employeeLoan._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Employee loans
		$scope.find = function() {
			$scope.employeeLoans = EmployeeLoans.query();
		};

		// Find existing Employee loan
		$scope.findOne = function() {
			$scope.employeeLoan = EmployeeLoans.get({ 
				employeeLoanId: $stateParams.employeeLoanId
			});
		};
	}
]);