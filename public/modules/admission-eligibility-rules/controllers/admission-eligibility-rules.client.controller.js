'use strict';

// Admission eligibility rules controller
angular.module('admission-eligibility-rules').controller('AdmissionEligibilityRulesController', ['$scope', '$stateParams', '$location', 'Authentication', 'AdmissionEligibilityRules',
	function($scope, $stateParams, $location, Authentication, AdmissionEligibilityRules) {
		$scope.authentication = Authentication;

		// Create new Admission eligibility rule
		$scope.create = function() {
			// Create new Admission eligibility rule object
			var admissionEligibilityRule = new AdmissionEligibilityRules ({
				name: this.name
			});

			// Redirect after save
			admissionEligibilityRule.$save(function(response) {
				$location.path('admission-eligibility-rules/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Admission eligibility rule
		$scope.remove = function(admissionEligibilityRule) {
			if ( admissionEligibilityRule ) { 
				admissionEligibilityRule.$remove();

				for (var i in $scope.admissionEligibilityRules) {
					if ($scope.admissionEligibilityRules [i] === admissionEligibilityRule) {
						$scope.admissionEligibilityRules.splice(i, 1);
					}
				}
			} else {
				$scope.admissionEligibilityRule.$remove(function() {
					$location.path('admission-eligibility-rules');
				});
			}
		};

		// Update existing Admission eligibility rule
		$scope.update = function() {
			var admissionEligibilityRule = $scope.admissionEligibilityRule;

			admissionEligibilityRule.$update(function() {
				$location.path('admission-eligibility-rules/' + admissionEligibilityRule._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Admission eligibility rules
		$scope.find = function() {
			$scope.admissionEligibilityRules = AdmissionEligibilityRules.query();
		};

		// Find existing Admission eligibility rule
		$scope.findOne = function() {
			$scope.admissionEligibilityRule = AdmissionEligibilityRules.get({ 
				admissionEligibilityRuleId: $stateParams.admissionEligibilityRuleId
			});
		};
	}
]);