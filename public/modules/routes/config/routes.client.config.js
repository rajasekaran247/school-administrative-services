'use strict';

// Configuring the Articles module
angular.module('routes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Routes', 'routes', 'dropdown', '/routes(/create)?');
		Menus.addSubMenuItem('topbar', 'routes', 'List Routes', 'routes');
		Menus.addSubMenuItem('topbar', 'routes', 'New Route', 'routes/create');
	}
]);