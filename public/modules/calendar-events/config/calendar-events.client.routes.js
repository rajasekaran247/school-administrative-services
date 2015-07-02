'use strict';

//Setting up route
angular.module('calendar-events').config(['$stateProvider',
	function($stateProvider) {
		// Calendar events state routing
		$stateProvider.
		state('listCalendarEvents', {
			url: '/calendar-events',
			templateUrl: 'modules/calendar-events/views/list-calendar-events.client.view.html'
		}).
		state('createCalendarEvent', {
			url: '/calendar-events/create',
			templateUrl: 'modules/calendar-events/views/create-calendar-event.client.view.html'
		}).
		state('viewCalendarEvent', {
			url: '/calendar-events/:calendarEventId',
			templateUrl: 'modules/calendar-events/views/view-calendar-event.client.view.html'
		}).
		state('editCalendarEvent', {
			url: '/calendar-events/:calendarEventId/edit',
			templateUrl: 'modules/calendar-events/views/edit-calendar-event.client.view.html'
		});
	}
]);