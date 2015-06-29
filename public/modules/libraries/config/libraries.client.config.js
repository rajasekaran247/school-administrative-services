'use strict';

// Configuring the Articles module
angular.module('libraries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Libraries', 'libraries', 'dropdown', '/libraries(/create)?');
		Menus.addSubMenuItem('topbar', 'libraries', 'List Libraries', 'libraries');
		Menus.addSubMenuItem('topbar', 'libraries', 'New Library', 'libraries/create');
	}
]);