'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Route = mongoose.model('Route'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, route;

/**
 * Route routes tests
 */
describe('Route CRUD tests', function() {
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

		// Save a user to the test db and create new Route
		user.save(function() {
			route = {
				name: 'Route Name'
			};

			done();
		});
	});

	it('should be able to save Route instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Route
				agent.post('/routes')
					.send(route)
					.expect(200)
					.end(function(routeSaveErr, routeSaveRes) {
						// Handle Route save error
						if (routeSaveErr) done(routeSaveErr);

						// Get a list of Routes
						agent.get('/routes')
							.end(function(routesGetErr, routesGetRes) {
								// Handle Route save error
								if (routesGetErr) done(routesGetErr);

								// Get Routes list
								var routes = routesGetRes.body;

								// Set assertions
								(routes[0].user._id).should.equal(userId);
								(routes[0].name).should.match('Route Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Route instance if not logged in', function(done) {
		agent.post('/routes')
			.send(route)
			.expect(401)
			.end(function(routeSaveErr, routeSaveRes) {
				// Call the assertion callback
				done(routeSaveErr);
			});
	});

	it('should not be able to save Route instance if no name is provided', function(done) {
		// Invalidate name field
		route.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Route
				agent.post('/routes')
					.send(route)
					.expect(400)
					.end(function(routeSaveErr, routeSaveRes) {
						// Set message assertion
						(routeSaveRes.body.message).should.match('Please fill Route name');
						
						// Handle Route save error
						done(routeSaveErr);
					});
			});
	});

	it('should be able to update Route instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Route
				agent.post('/routes')
					.send(route)
					.expect(200)
					.end(function(routeSaveErr, routeSaveRes) {
						// Handle Route save error
						if (routeSaveErr) done(routeSaveErr);

						// Update Route name
						route.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Route
						agent.put('/routes/' + routeSaveRes.body._id)
							.send(route)
							.expect(200)
							.end(function(routeUpdateErr, routeUpdateRes) {
								// Handle Route update error
								if (routeUpdateErr) done(routeUpdateErr);

								// Set assertions
								(routeUpdateRes.body._id).should.equal(routeSaveRes.body._id);
								(routeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Routes if not signed in', function(done) {
		// Create new Route model instance
		var routeObj = new Route(route);

		// Save the Route
		routeObj.save(function() {
			// Request Routes
			request(app).get('/routes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Route if not signed in', function(done) {
		// Create new Route model instance
		var routeObj = new Route(route);

		// Save the Route
		routeObj.save(function() {
			request(app).get('/routes/' + routeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', route.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Route instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Route
				agent.post('/routes')
					.send(route)
					.expect(200)
					.end(function(routeSaveErr, routeSaveRes) {
						// Handle Route save error
						if (routeSaveErr) done(routeSaveErr);

						// Delete existing Route
						agent.delete('/routes/' + routeSaveRes.body._id)
							.send(route)
							.expect(200)
							.end(function(routeDeleteErr, routeDeleteRes) {
								// Handle Route error error
								if (routeDeleteErr) done(routeDeleteErr);

								// Set assertions
								(routeDeleteRes.body._id).should.equal(routeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Route instance if not signed in', function(done) {
		// Set Route user 
		route.user = user;

		// Create new Route model instance
		var routeObj = new Route(route);

		// Save the Route
		routeObj.save(function() {
			// Try deleting Route
			request(app).delete('/routes/' + routeObj._id)
			.expect(401)
			.end(function(routeDeleteErr, routeDeleteRes) {
				// Set message assertion
				(routeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Route error error
				done(routeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Route.remove().exec();
		done();
	});
});