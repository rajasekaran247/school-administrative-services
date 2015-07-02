'use strict';

//Setting up route
angular.module('vouchers').config(['$stateProvider',
	function($stateProvider) {
		// Vouchers state routing
		$stateProvider.
		state('listVouchers', {
			url: '/vouchers',
			templateUrl: 'modules/vouchers/views/list-vouchers.client.view.html'
		}).
		state('createVoucher', {
			url: '/vouchers/create',
			templateUrl: 'modules/vouchers/views/create-voucher.client.view.html'
		}).
		state('viewVoucher', {
			url: '/vouchers/:voucherId',
			templateUrl: 'modules/vouchers/views/view-voucher.client.view.html'
		}).
		state('editVoucher', {
			url: '/vouchers/:voucherId/edit',
			templateUrl: 'modules/vouchers/views/edit-voucher.client.view.html'
		});
	}
]);