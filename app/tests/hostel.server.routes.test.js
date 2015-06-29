'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Hostel = mongoose.model('Hostel'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, hostel;

/**
 * Hostel routes tests
 */
describe('Hostel CRUD tests', function() {
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

		// Save a user to the test db and create new Hostel
		user.save(function() {
			hostel = {
				name: 'Hostel Name'
			};

			done();
		});
	});

	it('should be able to save Hostel instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel
				agent.post('/hostels')
					.send(hostel)
					.expect(200)
					.end(function(hostelSaveErr, hostelSaveRes) {
						// Handle Hostel save error
						if (hostelSaveErr) done(hostelSaveErr);

						// Get a list of Hostels
						agent.get('/hostels')
							.end(function(hostelsGetErr, hostelsGetRes) {
								// Handle Hostel save error
								if (hostelsGetErr) done(hostelsGetErr);

								// Get Hostels list
								var hostels = hostelsGetRes.body;

								// Set assertions
								(hostels[0].user._id).should.equal(userId);
								(hostels[0].name).should.match('Hostel Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Hostel instance if not logged in', function(done) {
		agent.post('/hostels')
			.send(hostel)
			.expect(401)
			.end(function(hostelSaveErr, hostelSaveRes) {
				// Call the assertion callback
				done(hostelSaveErr);
			});
	});

	it('should not be able to save Hostel instance if no name is provided', function(done) {
		// Invalidate name field
		hostel.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel
				agent.post('/hostels')
					.send(hostel)
					.expect(400)
					.end(function(hostelSaveErr, hostelSaveRes) {
						// Set message assertion
						(hostelSaveRes.body.message).should.match('Please fill Hostel name');
						
						// Handle Hostel save error
						done(hostelSaveErr);
					});
			});
	});

	it('should be able to update Hostel instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel
				agent.post('/hostels')
					.send(hostel)
					.expect(200)
					.end(function(hostelSaveErr, hostelSaveRes) {
						// Handle Hostel save error
						if (hostelSaveErr) done(hostelSaveErr);

						// Update Hostel name
						hostel.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Hostel
						agent.put('/hostels/' + hostelSaveRes.body._id)
							.send(hostel)
							.expect(200)
							.end(function(hostelUpdateErr, hostelUpdateRes) {
								// Handle Hostel update error
								if (hostelUpdateErr) done(hostelUpdateErr);

								// Set assertions
								(hostelUpdateRes.body._id).should.equal(hostelSaveRes.body._id);
								(hostelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Hostels if not signed in', function(done) {
		// Create new Hostel model instance
		var hostelObj = new Hostel(hostel);

		// Save the Hostel
		hostelObj.save(function() {
			// Request Hostels
			request(app).get('/hostels')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Hostel if not signed in', function(done) {
		// Create new Hostel model instance
		var hostelObj = new Hostel(hostel);

		// Save the Hostel
		hostelObj.save(function() {
			request(app).get('/hostels/' + hostelObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', hostel.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Hostel instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel
				agent.post('/hostels')
					.send(hostel)
					.expect(200)
					.end(function(hostelSaveErr, hostelSaveRes) {
						// Handle Hostel save error
						if (hostelSaveErr) done(hostelSaveErr);

						// Delete existing Hostel
						agent.delete('/hostels/' + hostelSaveRes.body._id)
							.send(hostel)
							.expect(200)
							.end(function(hostelDeleteErr, hostelDeleteRes) {
								// Handle Hostel error error
								if (hostelDeleteErr) done(hostelDeleteErr);

								// Set assertions
								(hostelDeleteRes.body._id).should.equal(hostelSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Hostel instance if not signed in', function(done) {
		// Set Hostel user 
		hostel.user = user;

		// Create new Hostel model instance
		var hostelObj = new Hostel(hostel);

		// Save the Hostel
		hostelObj.save(function() {
			// Try deleting Hostel
			request(app).delete('/hostels/' + hostelObj._id)
			.expect(401)
			.end(function(hostelDeleteErr, hostelDeleteRes) {
				// Set message assertion
				(hostelDeleteRes.body.message).should.match('User is not logged in');

				// Handle Hostel error error
				done(hostelDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Hostel.remove().exec();
		done();
	});
});