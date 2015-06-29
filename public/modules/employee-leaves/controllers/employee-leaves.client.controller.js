'use strict';

// Employee leaves controller
angular.module('employee-leaves').controller('EmployeeLeavesController', ['$scope', '$stateParams', '$location', 'Authentication', 'EmployeeLeaves',
	function($scope, $stateParams, $location, Authentication, EmployeeLeaves) {
		$scope.authentication = Authentication;

		// Create new Employee leave
		$scope.create = function() {
			// Create new Employee leave object
			var employeeLeave = new EmployeeLeaves ({
				name: this.name
			});

			// Redirect after save
			employeeLeave.$save(function(response) {
				$location.path('employee-leaves/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Employee leave
		$scope.remove = function(employeeLeave) {
			if ( employeeLeave ) { 
				employeeLeave.$remove();

				for (var i in $scope.employeeLeaves) {
					if ($scope.employeeLeaves [i] === employeeLeave) {
						$scope.employeeLeaves.splice(i, 1);
					}
				}
			} else {
				$scope.employeeLeave.$remove(function() {
					$location.path('employee-leaves');
				});
			}
		};

		// Update existing Employee leave
		$scope.update = function() {
			var employeeLeave = $scope.employeeLeave;

			employeeLeave.$update(function() {
				$location.path('employee-leaves/' + employeeLeave._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Employee leaves
		$scope.find = function() {
			$scope.employeeLeaves = EmployeeLeaves.query();
		};

		// Find existing Employee leave
		$scope.findOne = function() {
			$scope.employeeLeave = EmployeeLeaves.get({ 
				employeeLeaveId: $stateParams.employeeLeaveId
			});
		};
	}
]);