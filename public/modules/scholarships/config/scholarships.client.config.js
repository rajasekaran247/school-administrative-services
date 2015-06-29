'use strict';

// Configuring the Articles module
angular.module('scholarships').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Scholarships', 'scholarships', 'dropdown', '/scholarships(/create)?');
		Menus.addSubMenuItem('topbar', 'scholarships', 'List Scholarships', 'scholarships');
		Menus.addSubMenuItem('topbar', 'scholarships', 'New Scholarship', 'scholarships/create');
	}
]);