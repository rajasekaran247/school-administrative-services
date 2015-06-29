'use strict';

// Catalogs controller
angular.module('catalogs').controller('CatalogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Catalogs',
	function($scope, $stateParams, $location, Authentication, Catalogs) {
		$scope.authentication = Authentication;

		// Create new Catalog
		$scope.create = function() {
			// Create new Catalog object
			var catalog = new Catalogs ({
				name: this.name
			});

			// Redirect after save
			catalog.$save(function(response) {
				$location.path('catalogs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Catalog
		$scope.remove = function(catalog) {
			if ( catalog ) { 
				catalog.$remove();

				for (var i in $scope.catalogs) {
					if ($scope.catalogs [i] === catalog) {
						$scope.catalogs.splice(i, 1);
					}
				}
			} else {
				$scope.catalog.$remove(function() {
					$location.path('catalogs');
				});
			}
		};

		// Update existing Catalog
		$scope.update = function() {
			var catalog = $scope.catalog;

			catalog.$update(function() {
				$location.path('catalogs/' + catalog._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Catalogs
		$scope.find = function() {
			$scope.catalogs = Catalogs.query();
		};

		// Find existing Catalog
		$scope.findOne = function() {
			$scope.catalog = Catalogs.get({ 
				catalogId: $stateParams.catalogId
			});
		};
	}
]);