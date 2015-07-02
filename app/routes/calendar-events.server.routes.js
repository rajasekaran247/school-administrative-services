'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var calendarEvents = require('../../app/controllers/calendar-events.server.controller');

	// Calendar events Routes
	app.route('/calendar-events')
		.get(calendarEvents.list)
		.post(users.requiresLogin, calendarEvents.create);

	app.route('/calendar-events/:calendarEventId')
		.get(calendarEvents.read)
		.put(users.requiresLogin, calendarEvents.hasAuthorization, calendarEvents.update)
		.delete(users.requiresLogin, calendarEvents.hasAuthorization, calendarEvents.delete);

	// Finish by binding the Calendar event middleware
	app.param('calendarEventId', calendarEvents.calendarEventByID);
};
