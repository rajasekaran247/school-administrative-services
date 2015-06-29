'use strict';

// Configuring the Articles module
angular.module('transport-routes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Transport routes', 'transport-routes', 'dropdown', '/transport-routes(/create)?');
		Menus.addSubMenuItem('topbar', 'transport-routes', 'List Transport routes', 'transport-routes');
		Menus.addSubMenuItem('topbar', 'transport-routes', 'New Transport route', 'transport-routes/create');
	}
]);