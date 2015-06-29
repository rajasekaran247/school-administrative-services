'use strict';

// Configuring the Articles module
angular.module('hostel-allotments').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Hostel allotments', 'hostel-allotments', 'dropdown', '/hostel-allotments(/create)?');
		Menus.addSubMenuItem('topbar', 'hostel-allotments', 'List Hostel allotments', 'hostel-allotments');
		Menus.addSubMenuItem('topbar', 'hostel-allotments', 'New Hostel allotment', 'hostel-allotments/create');
	}
]);