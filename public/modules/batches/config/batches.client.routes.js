'use strict';

//Setting up route
angular.module('batches').config(['$stateProvider',
	function($stateProvider) {
		// Batches state routing
		$stateProvider.
		state('listBatches', {
			url: '/batches',
			templateUrl: 'modules/batches/views/list-batches.client.view.html'
		}).
		state('createBatch', {
			url: '/batches/create',
			templateUrl: 'modules/batches/views/create-batch.client.view.html'
		}).
		state('viewBatch', {
			url: '/batches/:batchId',
			templateUrl: 'modules/batches/views/view-batch.client.view.html'
		}).
		state('editBatch', {
			url: '/batches/:batchId/edit',
			templateUrl: 'modules/batches/views/edit-batch.client.view.html'
		});
	}
]);