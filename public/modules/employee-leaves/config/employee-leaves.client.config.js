'use strict';

// Configuring the Articles module
angular.module('employee-leaves').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Employee leaves', 'employee-leaves', 'dropdown', '/employee-leaves(/create)?');
		Menus.addSubMenuItem('topbar', 'employee-leaves', 'List Employee leaves', 'employee-leaves');
		Menus.addSubMenuItem('topbar', 'employee-leaves', 'New Employee leave', 'employee-leaves/create');
	}
]);