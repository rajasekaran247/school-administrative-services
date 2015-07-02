'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	CalendarEvent = mongoose.model('CalendarEvent'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, calendarEvent;

/**
 * Calendar event routes tests
 */
describe('Calendar event CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Calendar event
		user.save(function() {
			calendarEvent = {
				name: 'Calendar event Name'
			};

			done();
		});
	});

	it('should be able to save Calendar event instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendar event
				agent.post('/calendar-events')
					.send(calendarEvent)
					.expect(200)
					.end(function(calendarEventSaveErr, calendarEventSaveRes) {
						// Handle Calendar event save error
						if (calendarEventSaveErr) done(calendarEventSaveErr);

						// Get a list of Calendar events
						agent.get('/calendar-events')
							.end(function(calendarEventsGetErr, calendarEventsGetRes) {
								// Handle Calendar event save error
								if (calendarEventsGetErr) done(calendarEventsGetErr);

								// Get Calendar events list
								var calendarEvents = calendarEventsGetRes.body;

								// Set assertions
								(calendarEvents[0].user._id).should.equal(userId);
								(calendarEvents[0].name).should.match('Calendar event Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Calendar event instance if not logged in', function(done) {
		agent.post('/calendar-events')
			.send(calendarEvent)
			.expect(401)
			.end(function(calendarEventSaveErr, calendarEventSaveRes) {
				// Call the assertion callback
				done(calendarEventSaveErr);
			});
	});

	it('should not be able to save Calendar event instance if no name is provided', function(done) {
		// Invalidate name field
		calendarEvent.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendar event
				agent.post('/calendar-events')
					.send(calendarEvent)
					.expect(400)
					.end(function(calendarEventSaveErr, calendarEventSaveRes) {
						// Set message assertion
						(calendarEventSaveRes.body.message).should.match('Please fill Calendar event name');
						
						// Handle Calendar event save error
						done(calendarEventSaveErr);
					});
			});
	});

	it('should be able to update Calendar event instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendar event
				agent.post('/calendar-events')
					.send(calendarEvent)
					.expect(200)
					.end(function(calendarEventSaveErr, calendarEventSaveRes) {
						// Handle Calendar event save error
						if (calendarEventSaveErr) done(calendarEventSaveErr);

						// Update Calendar event name
						calendarEvent.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Calendar event
						agent.put('/calendar-events/' + calendarEventSaveRes.body._id)
							.send(calendarEvent)
							.expect(200)
							.end(function(calendarEventUpdateErr, calendarEventUpdateRes) {
								// Handle Calendar event update error
								if (calendarEventUpdateErr) done(calendarEventUpdateErr);

								// Set assertions
								(calendarEventUpdateRes.body._id).should.equal(calendarEventSaveRes.body._id);
								(calendarEventUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Calendar events if not signed in', function(done) {
		// Create new Calendar event model instance
		var calendarEventObj = new CalendarEvent(calendarEvent);

		// Save the Calendar event
		calendarEventObj.save(function() {
			// Request Calendar events
			request(app).get('/calendar-events')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Calendar event if not signed in', function(done) {
		// Create new Calendar event model instance
		var calendarEventObj = new CalendarEvent(calendarEvent);

		// Save the Calendar event
		calendarEventObj.save(function() {
			request(app).get('/calendar-events/' + calendarEventObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', calendarEvent.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Calendar event instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendar event
				agent.post('/calendar-events')
					.send(calendarEvent)
					.expect(200)
					.end(function(calendarEventSaveErr, calendarEventSaveRes) {
						// Handle Calendar event save error
						if (calendarEventSaveErr) done(calendarEventSaveErr);

						// Delete existing Calendar event
						agent.delete('/calendar-events/' + calendarEventSaveRes.body._id)
							.send(calendarEvent)
							.expect(200)
							.end(function(calendarEventDeleteErr, calendarEventDeleteRes) {
								// Handle Calendar event error error
								if (calendarEventDeleteErr) done(calendarEventDeleteErr);

								// Set assertions
								(calendarEventDeleteRes.body._id).should.equal(calendarEventSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Calendar event instance if not signed in', function(done) {
		// Set Calendar event user 
		calendarEvent.user = user;

		// Create new Calendar event model instance
		var calendarEventObj = new CalendarEvent(calendarEvent);

		// Save the Calendar event
		calendarEventObj.save(function() {
			// Try deleting Calendar event
			request(app).delete('/calendar-events/' + calendarEventObj._id)
			.expect(401)
			.end(function(calendarEventDeleteErr, calendarEventDeleteRes) {
				// Set message assertion
				(calendarEventDeleteRes.body.message).should.match('User is not logged in');

				// Handle Calendar event error error
				done(calendarEventDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		CalendarEvent.remove().exec();
		done();
	});
});