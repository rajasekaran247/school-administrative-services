'use strict';

//Calendar events service used to communicate Calendar events REST endpoints
angular.module('calendar-events').factory('CalendarEvents', ['$resource',
	function($resource) {
		return $resource('calendar-events/:calendarEventId', { calendarEventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);