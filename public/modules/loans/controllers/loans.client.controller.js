'use strict';

// Loans controller
angular.module('loans').controller('LoansController', ['$scope', '$stateParams', '$location', 'Authentication', 'Loans',
	function($scope, $stateParams, $location, Authentication, Loans) {
		$scope.authentication = Authentication;

		// Create new Loan
		$scope.create = function() {
			// Create new Loan object
			var loan = new Loans ({
				name: this.name
			});

			// Redirect after save
			loan.$save(function(response) {
				$location.path('loans/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Loan
		$scope.remove = function(loan) {
			if ( loan ) { 
				loan.$remove();

				for (var i in $scope.loans) {
					if ($scope.loans [i] === loan) {
						$scope.loans.splice(i, 1);
					}
				}
			} else {
				$scope.loan.$remove(function() {
					$location.path('loans');
				});
			}
		};

		// Update existing Loan
		$scope.update = function() {
			var loan = $scope.loan;

			loan.$update(function() {
				$location.path('loans/' + loan._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Loans
		$scope.find = function() {
			$scope.loans = Loans.query();
		};

		// Find existing Loan
		$scope.findOne = function() {
			$scope.loan = Loans.get({ 
				loanId: $stateParams.loanId
			});
		};
	}
]);