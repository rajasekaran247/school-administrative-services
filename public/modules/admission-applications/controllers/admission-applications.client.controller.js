'use strict';

// Admission applications controller
angular.module('admission-applications').controller('AdmissionApplicationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'AdmissionApplications',
	function($scope, $stateParams, $location, Authentication, AdmissionApplications) {
		$scope.authentication = Authentication;

		// Create new Admission application
		$scope.create = function() {
			// Create new Admission application object
			var admissionApplication = new AdmissionApplications ({
				name: this.name
			});

			// Redirect after save
			admissionApplication.$save(function(response) {
				$location.path('admission-applications/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Admission application
		$scope.remove = function(admissionApplication) {
			if ( admissionApplication ) { 
				admissionApplication.$remove();

				for (var i in $scope.admissionApplications) {
					if ($scope.admissionApplications [i] === admissionApplication) {
						$scope.admissionApplications.splice(i, 1);
					}
				}
			} else {
				$scope.admissionApplication.$remove(function() {
					$location.path('admission-applications');
				});
			}
		};

		// Update existing Admission application
		$scope.update = function() {
			var admissionApplication = $scope.admissionApplication;

			admissionApplication.$update(function() {
				$location.path('admission-applications/' + admissionApplication._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Admission applications
		$scope.find = function() {
			$scope.admissionApplications = AdmissionApplications.query();
		};

		// Find existing Admission application
		$scope.findOne = function() {
			$scope.admissionApplication = AdmissionApplications.get({ 
				admissionApplicationId: $stateParams.admissionApplicationId
			});
		};
	}
]);