'use strict';

// Gate registers controller
angular.module('gate-registers').controller('GateRegistersController', ['$scope', '$stateParams', '$location', 'Authentication', 'GateRegisters',
	function($scope, $stateParams, $location, Authentication, GateRegisters) {
		$scope.authentication = Authentication;

		// Create new Gate register
		$scope.create = function() {
			// Create new Gate register object
			var gateRegister = new GateRegisters ({
				name: this.name
			});

			// Redirect after save
			gateRegister.$save(function(response) {
				$location.path('gate-registers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gate register
		$scope.remove = function(gateRegister) {
			if ( gateRegister ) { 
				gateRegister.$remove();

				for (var i in $scope.gateRegisters) {
					if ($scope.gateRegisters [i] === gateRegister) {
						$scope.gateRegisters.splice(i, 1);
					}
				}
			} else {
				$scope.gateRegister.$remove(function() {
					$location.path('gate-registers');
				});
			}
		};

		// Update existing Gate register
		$scope.update = function() {
			var gateRegister = $scope.gateRegister;

			gateRegister.$update(function() {
				$location.path('gate-registers/' + gateRegister._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gate registers
		$scope.find = function() {
			$scope.gateRegisters = GateRegisters.query();
		};

		// Find existing Gate register
		$scope.findOne = function() {
			$scope.gateRegister = GateRegisters.get({ 
				gateRegisterId: $stateParams.gateRegisterId
			});
		};
	}
]);