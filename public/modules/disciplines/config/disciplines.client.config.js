'use strict';

// Configuring the Articles module
angular.module('disciplines').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Disciplines', 'disciplines', 'dropdown', '/disciplines(/create)?');
		Menus.addSubMenuItem('topbar', 'disciplines', 'List Disciplines', 'disciplines');
		Menus.addSubMenuItem('topbar', 'disciplines', 'New Discipline', 'disciplines/create');
	}
]);