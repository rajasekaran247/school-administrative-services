'use strict';

// Vouchers controller
angular.module('vouchers').controller('VouchersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vouchers',
	function($scope, $stateParams, $location, Authentication, Vouchers) {
		$scope.authentication = Authentication;

		// Create new Voucher
		$scope.create = function() {
			// Create new Voucher object
			var voucher = new Vouchers ({
				name: this.name
			});

			// Redirect after save
			voucher.$save(function(response) {
				$location.path('vouchers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Voucher
		$scope.remove = function(voucher) {
			if ( voucher ) { 
				voucher.$remove();

				for (var i in $scope.vouchers) {
					if ($scope.vouchers [i] === voucher) {
						$scope.vouchers.splice(i, 1);
					}
				}
			} else {
				$scope.voucher.$remove(function() {
					$location.path('vouchers');
				});
			}
		};

		// Update existing Voucher
		$scope.update = function() {
			var voucher = $scope.voucher;

			voucher.$update(function() {
				$location.path('vouchers/' + voucher._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Vouchers
		$scope.find = function() {
			$scope.vouchers = Vouchers.query();
		};

		// Find existing Voucher
		$scope.findOne = function() {
			$scope.voucher = Vouchers.get({ 
				voucherId: $stateParams.voucherId
			});
		};
	}
]);