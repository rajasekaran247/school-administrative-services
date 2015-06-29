'use strict';

// Configuring the Articles module
angular.module('gate-registers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Gate registers', 'gate-registers', 'dropdown', '/gate-registers(/create)?');
		Menus.addSubMenuItem('topbar', 'gate-registers', 'List Gate registers', 'gate-registers');
		Menus.addSubMenuItem('topbar', 'gate-registers', 'New Gate register', 'gate-registers/create');
	}
]);