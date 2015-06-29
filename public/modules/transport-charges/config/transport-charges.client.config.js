'use strict';

// Configuring the Articles module
angular.module('transport-charges').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Transport charges', 'transport-charges', 'dropdown', '/transport-charges(/create)?');
		Menus.addSubMenuItem('topbar', 'transport-charges', 'List Transport charges', 'transport-charges');
		Menus.addSubMenuItem('topbar', 'transport-charges', 'New Transport charge', 'transport-charges/create');
	}
]);