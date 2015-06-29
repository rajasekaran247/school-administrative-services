'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	TransportRoute = mongoose.model('TransportRoute'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, transportRoute;

/**
 * Transport route routes tests
 */
describe('Transport route CRUD tests', function() {
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

		// Save a user to the test db and create new Transport route
		user.save(function() {
			transportRoute = {
				name: 'Transport route Name'
			};

			done();
		});
	});

	it('should be able to save Transport route instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transport route
				agent.post('/transport-routes')
					.send(transportRoute)
					.expect(200)
					.end(function(transportRouteSaveErr, transportRouteSaveRes) {
						// Handle Transport route save error
						if (transportRouteSaveErr) done(transportRouteSaveErr);

						// Get a list of Transport routes
						agent.get('/transport-routes')
							.end(function(transportRoutesGetErr, transportRoutesGetRes) {
								// Handle Transport route save error
								if (transportRoutesGetErr) done(transportRoutesGetErr);

								// Get Transport routes list
								var transportRoutes = transportRoutesGetRes.body;

								// Set assertions
								(transportRoutes[0].user._id).should.equal(userId);
								(transportRoutes[0].name).should.match('Transport route Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Transport route instance if not logged in', function(done) {
		agent.post('/transport-routes')
			.send(transportRoute)
			.expect(401)
			.end(function(transportRouteSaveErr, transportRouteSaveRes) {
				// Call the assertion callback
				done(transportRouteSaveErr);
			});
	});

	it('should not be able to save Transport route instance if no name is provided', function(done) {
		// Invalidate name field
		transportRoute.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transport route
				agent.post('/transport-routes')
					.send(transportRoute)
					.expect(400)
					.end(function(transportRouteSaveErr, transportRouteSaveRes) {
						// Set message assertion
						(transportRouteSaveRes.body.message).should.match('Please fill Transport route name');
						
						// Handle Transport route save error
						done(transportRouteSaveErr);
					});
			});
	});

	it('should be able to update Transport route instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transport route
				agent.post('/transport-routes')
					.send(transportRoute)
					.expect(200)
					.end(function(transportRouteSaveErr, transportRouteSaveRes) {
						// Handle Transport route save error
						if (transportRouteSaveErr) done(transportRouteSaveErr);

						// Update Transport route name
						transportRoute.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Transport route
						agent.put('/transport-routes/' + transportRouteSaveRes.body._id)
							.send(transportRoute)
							.expect(200)
							.end(function(transportRouteUpdateErr, transportRouteUpdateRes) {
								// Handle Transport route update error
								if (transportRouteUpdateErr) done(transportRouteUpdateErr);

								// Set assertions
								(transportRouteUpdateRes.body._id).should.equal(transportRouteSaveRes.body._id);
								(transportRouteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Transport routes if not signed in', function(done) {
		// Create new Transport route model instance
		var transportRouteObj = new TransportRoute(transportRoute);

		// Save the Transport route
		transportRouteObj.save(function() {
			// Request Transport routes
			request(app).get('/transport-routes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Transport route if not signed in', function(done) {
		// Create new Transport route model instance
		var transportRouteObj = new TransportRoute(transportRoute);

		// Save the Transport route
		transportRouteObj.save(function() {
			request(app).get('/transport-routes/' + transportRouteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', transportRoute.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Transport route instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transport route
				agent.post('/transport-routes')
					.send(transportRoute)
					.expect(200)
					.end(function(transportRouteSaveErr, transportRouteSaveRes) {
						// Handle Transport route save error
						if (transportRouteSaveErr) done(transportRouteSaveErr);

						// Delete existing Transport route
						agent.delete('/transport-routes/' + transportRouteSaveRes.body._id)
							.send(transportRoute)
							.expect(200)
							.end(function(transportRouteDeleteErr, transportRouteDeleteRes) {
								// Handle Transport route error error
								if (transportRouteDeleteErr) done(transportRouteDeleteErr);

								// Set assertions
								(transportRouteDeleteRes.body._id).should.equal(transportRouteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Transport route instance if not signed in', function(done) {
		// Set Transport route user 
		transportRoute.user = user;

		// Create new Transport route model instance
		var transportRouteObj = new TransportRoute(transportRoute);

		// Save the Transport route
		transportRouteObj.save(function() {
			// Try deleting Transport route
			request(app).delete('/transport-routes/' + transportRouteObj._id)
			.expect(401)
			.end(function(transportRouteDeleteErr, transportRouteDeleteRes) {
				// Set message assertion
				(transportRouteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Transport route error error
				done(transportRouteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		TransportRoute.remove().exec();
		done();
	});
});