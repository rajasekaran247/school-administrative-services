'use strict';

// Grades controller
angular.module('grades').controller('GradesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Grades',
	function($scope, $stateParams, $location, Authentication, Grades) {
		$scope.authentication = Authentication;

		// Create new Grade
		$scope.create = function() {
			// Create new Grade object
			var grade = new Grades ({
				name: this.name
			});

			// Redirect after save
			grade.$save(function(response) {
				$location.path('grades/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Grade
		$scope.remove = function(grade) {
			if ( grade ) { 
				grade.$remove();

				for (var i in $scope.grades) {
					if ($scope.grades [i] === grade) {
						$scope.grades.splice(i, 1);
					}
				}
			} else {
				$scope.grade.$remove(function() {
					$location.path('grades');
				});
			}
		};

		// Update existing Grade
		$scope.update = function() {
			var grade = $scope.grade;

			grade.$update(function() {
				$location.path('grades/' + grade._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Grades
		$scope.find = function() {
			$scope.grades = Grades.query();
		};

		// Find existing Grade
		$scope.findOne = function() {
			$scope.grade = Grades.get({ 
				gradeId: $stateParams.gradeId
			});
		};
	}
]);