'use strict';

// Configuring the Articles module
angular.module('hostel-rooms').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Hostel rooms', 'hostel-rooms', 'dropdown', '/hostel-rooms(/create)?');
		Menus.addSubMenuItem('topbar', 'hostel-rooms', 'List Hostel rooms', 'hostel-rooms');
		Menus.addSubMenuItem('topbar', 'hostel-rooms', 'New Hostel room', 'hostel-rooms/create');
	}
]);