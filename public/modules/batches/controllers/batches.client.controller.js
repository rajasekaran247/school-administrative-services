'use strict';

// Batches controller
angular.module('batches').controller('BatchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Batches',
	function($scope, $stateParams, $location, Authentication, Batches) {
		$scope.authentication = Authentication;

		// Create new Batch
		$scope.create = function() {
			// Create new Batch object
			var batch = new Batches ({
				name: this.name
			});

			// Redirect after save
			batch.$save(function(response) {
				$location.path('batches/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Batch
		$scope.remove = function(batch) {
			if ( batch ) { 
				batch.$remove();

				for (var i in $scope.batches) {
					if ($scope.batches [i] === batch) {
						$scope.batches.splice(i, 1);
					}
				}
			} else {
				$scope.batch.$remove(function() {
					$location.path('batches');
				});
			}
		};

		// Update existing Batch
		$scope.update = function() {
			var batch = $scope.batch;

			batch.$update(function() {
				$location.path('batches/' + batch._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Batches
		$scope.find = function() {
			$scope.batches = Batches.query();
		};

		// Find existing Batch
		$scope.findOne = function() {
			$scope.batch = Batches.get({ 
				batchId: $stateParams.batchId
			});
		};
	}
]);