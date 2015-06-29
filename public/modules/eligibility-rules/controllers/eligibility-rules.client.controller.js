'use strict';

// Eligibility rules controller
angular.module('eligibility-rules').controller('EligibilityRulesController', ['$scope', '$stateParams', '$location', 'Authentication', 'EligibilityRules',
	function($scope, $stateParams, $location, Authentication, EligibilityRules) {
		$scope.authentication = Authentication;

		// Create new Eligibility rule
		$scope.create = function() {
			// Create new Eligibility rule object
			var eligibilityRule = new EligibilityRules ({
				name: this.name
			});

			// Redirect after save
			eligibilityRule.$save(function(response) {
				$location.path('eligibility-rules/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Eligibility rule
		$scope.remove = function(eligibilityRule) {
			if ( eligibilityRule ) { 
				eligibilityRule.$remove();

				for (var i in $scope.eligibilityRules) {
					if ($scope.eligibilityRules [i] === eligibilityRule) {
						$scope.eligibilityRules.splice(i, 1);
					}
				}
			} else {
				$scope.eligibilityRule.$remove(function() {
					$location.path('eligibility-rules');
				});
			}
		};

		// Update existing Eligibility rule
		$scope.update = function() {
			var eligibilityRule = $scope.eligibilityRule;

			eligibilityRule.$update(function() {
				$location.path('eligibility-rules/' + eligibilityRule._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Eligibility rules
		$scope.find = function() {
			$scope.eligibilityRules = EligibilityRules.query();
		};

		// Find existing Eligibility rule
		$scope.findOne = function() {
			$scope.eligibilityRule = EligibilityRules.get({ 
				eligibilityRuleId: $stateParams.eligibilityRuleId
			});
		};
	}
]);