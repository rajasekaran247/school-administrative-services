'use strict';

// Transport routes controller
angular.module('transport-routes').controller('TransportRoutesController', ['$scope', '$stateParams', '$location', 'Authentication', 'TransportRoutes',
	function($scope, $stateParams, $location, Authentication, TransportRoutes) {
		$scope.authentication = Authentication;

		// Create new Transport route
		$scope.create = function() {
			// Create new Transport route object
			var transportRoute = new TransportRoutes ({
				name: this.name
			});

			// Redirect after save
			transportRoute.$save(function(response) {
				$location.path('transport-routes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Transport route
		$scope.remove = function(transportRoute) {
			if ( transportRoute ) { 
				transportRoute.$remove();

				for (var i in $scope.transportRoutes) {
					if ($scope.transportRoutes [i] === transportRoute) {
						$scope.transportRoutes.splice(i, 1);
					}
				}
			} else {
				$scope.transportRoute.$remove(function() {
					$location.path('transport-routes');
				});
			}
		};

		// Update existing Transport route
		$scope.update = function() {
			var transportRoute = $scope.transportRoute;

			transportRoute.$update(function() {
				$location.path('transport-routes/' + transportRoute._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Transport routes
		$scope.find = function() {
			$scope.transportRoutes = TransportRoutes.query();
		};

		// Find existing Transport route
		$scope.findOne = function() {
			$scope.transportRoute = TransportRoutes.get({ 
				transportRouteId: $stateParams.transportRouteId
			});
		};
	}
]);