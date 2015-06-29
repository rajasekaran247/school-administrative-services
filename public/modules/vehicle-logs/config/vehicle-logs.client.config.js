'use strict';

// Configuring the Articles module
angular.module('vehicle-logs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Vehicle logs', 'vehicle-logs', 'dropdown', '/vehicle-logs(/create)?');
		Menus.addSubMenuItem('topbar', 'vehicle-logs', 'List Vehicle logs', 'vehicle-logs');
		Menus.addSubMenuItem('topbar', 'vehicle-logs', 'New Vehicle log', 'vehicle-logs/create');
	}
]);