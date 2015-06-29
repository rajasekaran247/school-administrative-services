'use strict';

// Configuring the Articles module
angular.module('employee-loans').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Employee loans', 'employee-loans', 'dropdown', '/employee-loans(/create)?');
		Menus.addSubMenuItem('topbar', 'employee-loans', 'List Employee loans', 'employee-loans');
		Menus.addSubMenuItem('topbar', 'employee-loans', 'New Employee loan', 'employee-loans/create');
	}
]);