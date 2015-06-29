'use strict';

// Configuring the Articles module
angular.module('employee-payrolls').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Employee payrolls', 'employee-payrolls', 'dropdown', '/employee-payrolls(/create)?');
		Menus.addSubMenuItem('topbar', 'employee-payrolls', 'List Employee payrolls', 'employee-payrolls');
		Menus.addSubMenuItem('topbar', 'employee-payrolls', 'New Employee payroll', 'employee-payrolls/create');
	}
]);