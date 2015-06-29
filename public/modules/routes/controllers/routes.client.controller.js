'use strict';

// Routes controller
angular.module('routes').controller('RoutesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Routes',
	function($scope, $stateParams, $location, Authentication, Routes) {
		$scope.authentication = Authentication;

		// Create new Route
		$scope.create = function() {
			// Create new Route object
			var route = new Routes ({
				name: this.name
			});

			// Redirect after save
			route.$save(function(response) {
				$location.path('routes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Route
		$scope.remove = function(route) {
			if ( route ) { 
				route.$remove();

				for (var i in $scope.routes) {
					if ($scope.routes [i] === route) {
						$scope.routes.splice(i, 1);
					}
				}
			} else {
				$scope.route.$remove(function() {
					$location.path('routes');
				});
			}
		};

		// Update existing Route
		$scope.update = function() {
			var route = $scope.route;

			route.$update(function() {
				$location.path('routes/' + route._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Routes
		$scope.find = function() {
			$scope.routes = Routes.query();
		};

		// Find existing Route
		$scope.findOne = function() {
			$scope.route = Routes.get({ 
				routeId: $stateParams.routeId
			});
		};
	}
]);