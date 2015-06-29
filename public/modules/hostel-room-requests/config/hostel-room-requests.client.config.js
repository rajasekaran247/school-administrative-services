'use strict';

// Configuring the Articles module
angular.module('hostel-room-requests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Hostel room requests', 'hostel-room-requests', 'dropdown', '/hostel-room-requests(/create)?');
		Menus.addSubMenuItem('topbar', 'hostel-room-requests', 'List Hostel room requests', 'hostel-room-requests');
		Menus.addSubMenuItem('topbar', 'hostel-room-requests', 'New Hostel room request', 'hostel-room-requests/create');
	}
]);