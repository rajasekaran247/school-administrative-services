'use strict';

// Configuring the Articles module
angular.module('vouchers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Vouchers', 'vouchers', 'dropdown', '/vouchers(/create)?');
		Menus.addSubMenuItem('topbar', 'vouchers', 'List Vouchers', 'vouchers');
		Menus.addSubMenuItem('topbar', 'vouchers', 'New Voucher', 'vouchers/create');
	}
]);