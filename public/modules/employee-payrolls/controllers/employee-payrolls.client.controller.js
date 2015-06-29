'use strict';

// Employee payrolls controller
angular.module('employee-payrolls').controller('EmployeePayrollsController', ['$scope', '$stateParams', '$location', 'Authentication', 'EmployeePayrolls',
	function($scope, $stateParams, $location, Authentication, EmployeePayrolls) {
		$scope.authentication = Authentication;

		// Create new Employee payroll
		$scope.create = function() {
			// Create new Employee payroll object
			var employeePayroll = new EmployeePayrolls ({
				name: this.name
			});

			// Redirect after save
			employeePayroll.$save(function(response) {
				$location.path('employee-payrolls/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Employee payroll
		$scope.remove = function(employeePayroll) {
			if ( employeePayroll ) { 
				employeePayroll.$remove();

				for (var i in $scope.employeePayrolls) {
					if ($scope.employeePayrolls [i] === employeePayroll) {
						$scope.employeePayrolls.splice(i, 1);
					}
				}
			} else {
				$scope.employeePayroll.$remove(function() {
					$location.path('employee-payrolls');
				});
			}
		};

		// Update existing Employee payroll
		$scope.update = function() {
			var employeePayroll = $scope.employeePayroll;

			employeePayroll.$update(function() {
				$location.path('employee-payrolls/' + employeePayroll._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Employee payrolls
		$scope.find = function() {
			$scope.employeePayrolls = EmployeePayrolls.query();
		};

		// Find existing Employee payroll
		$scope.findOne = function() {
			$scope.employeePayroll = EmployeePayrolls.get({ 
				employeePayrollId: $stateParams.employeePayrollId
			});
		};
	}
]);