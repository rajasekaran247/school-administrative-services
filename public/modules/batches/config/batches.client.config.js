'use strict';

// Configuring the Articles module
angular.module('batches').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Batches', 'batches', 'dropdown', '/batches(/create)?');
		Menus.addSubMenuItem('topbar', 'batches', 'List Batches', 'batches');
		Menus.addSubMenuItem('topbar', 'batches', 'New Batch', 'batches/create');
	}
]);