'use strict';

// Configuring the Articles module
angular.module('fees').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Fees', 'fees', 'dropdown', '/fees(/create)?');
		Menus.addSubMenuItem('topbar', 'fees', 'List Fees', 'fees');
		Menus.addSubMenuItem('topbar', 'fees', 'New Fee', 'fees/create');
	}
]);