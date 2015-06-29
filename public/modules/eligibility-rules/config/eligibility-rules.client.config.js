'use strict';

// Configuring the Articles module
angular.module('eligibility-rules').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Eligibility rules', 'eligibility-rules', 'dropdown', '/eligibility-rules(/create)?');
		Menus.addSubMenuItem('topbar', 'eligibility-rules', 'List Eligibility rules', 'eligibility-rules');
		Menus.addSubMenuItem('topbar', 'eligibility-rules', 'New Eligibility rule', 'eligibility-rules/create');
	}
]);