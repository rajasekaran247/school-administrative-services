'use strict';

// Configuring the Articles module
angular.module('catalogs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Catalogs', 'catalogs', 'dropdown', '/catalogs(/create)?');
		Menus.addSubMenuItem('topbar', 'catalogs', 'List Catalogs', 'catalogs');
		Menus.addSubMenuItem('topbar', 'catalogs', 'New Catalog', 'catalogs/create');
	}
]);