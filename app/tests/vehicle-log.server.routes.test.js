'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	VehicleLog = mongoose.model('VehicleLog'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, vehicleLog;

/**
 * Vehicle log routes tests
 */
describe('Vehicle log CRUD tests', function() {
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

		// Save a user to the test db and create new Vehicle log
		user.save(function() {
			vehicleLog = {
				name: 'Vehicle log Name'
			};

			done();
		});
	});

	it('should be able to save Vehicle log instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle log
				agent.post('/vehicle-logs')
					.send(vehicleLog)
					.expect(200)
					.end(function(vehicleLogSaveErr, vehicleLogSaveRes) {
						// Handle Vehicle log save error
						if (vehicleLogSaveErr) done(vehicleLogSaveErr);

						// Get a list of Vehicle logs
						agent.get('/vehicle-logs')
							.end(function(vehicleLogsGetErr, vehicleLogsGetRes) {
								// Handle Vehicle log save error
								if (vehicleLogsGetErr) done(vehicleLogsGetErr);

								// Get Vehicle logs list
								var vehicleLogs = vehicleLogsGetRes.body;

								// Set assertions
								(vehicleLogs[0].user._id).should.equal(userId);
								(vehicleLogs[0].name).should.match('Vehicle log Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Vehicle log instance if not logged in', function(done) {
		agent.post('/vehicle-logs')
			.send(vehicleLog)
			.expect(401)
			.end(function(vehicleLogSaveErr, vehicleLogSaveRes) {
				// Call the assertion callback
				done(vehicleLogSaveErr);
			});
	});

	it('should not be able to save Vehicle log instance if no name is provided', function(done) {
		// Invalidate name field
		vehicleLog.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle log
				agent.post('/vehicle-logs')
					.send(vehicleLog)
					.expect(400)
					.end(function(vehicleLogSaveErr, vehicleLogSaveRes) {
						// Set message assertion
						(vehicleLogSaveRes.body.message).should.match('Please fill Vehicle log name');
						
						// Handle Vehicle log save error
						done(vehicleLogSaveErr);
					});
			});
	});

	it('should be able to update Vehicle log instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle log
				agent.post('/vehicle-logs')
					.send(vehicleLog)
					.expect(200)
					.end(function(vehicleLogSaveErr, vehicleLogSaveRes) {
						// Handle Vehicle log save error
						if (vehicleLogSaveErr) done(vehicleLogSaveErr);

						// Update Vehicle log name
						vehicleLog.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Vehicle log
						agent.put('/vehicle-logs/' + vehicleLogSaveRes.body._id)
							.send(vehicleLog)
							.expect(200)
							.end(function(vehicleLogUpdateErr, vehicleLogUpdateRes) {
								// Handle Vehicle log update error
								if (vehicleLogUpdateErr) done(vehicleLogUpdateErr);

								// Set assertions
								(vehicleLogUpdateRes.body._id).should.equal(vehicleLogSaveRes.body._id);
								(vehicleLogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Vehicle logs if not signed in', function(done) {
		// Create new Vehicle log model instance
		var vehicleLogObj = new VehicleLog(vehicleLog);

		// Save the Vehicle log
		vehicleLogObj.save(function() {
			// Request Vehicle logs
			request(app).get('/vehicle-logs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Vehicle log if not signed in', function(done) {
		// Create new Vehicle log model instance
		var vehicleLogObj = new VehicleLog(vehicleLog);

		// Save the Vehicle log
		vehicleLogObj.save(function() {
			request(app).get('/vehicle-logs/' + vehicleLogObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', vehicleLog.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Vehicle log instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle log
				agent.post('/vehicle-logs')
					.send(vehicleLog)
					.expect(200)
					.end(function(vehicleLogSaveErr, vehicleLogSaveRes) {
						// Handle Vehicle log save error
						if (vehicleLogSaveErr) done(vehicleLogSaveErr);

						// Delete existing Vehicle log
						agent.delete('/vehicle-logs/' + vehicleLogSaveRes.body._id)
							.send(vehicleLog)
							.expect(200)
							.end(function(vehicleLogDeleteErr, vehicleLogDeleteRes) {
								// Handle Vehicle log error error
								if (vehicleLogDeleteErr) done(vehicleLogDeleteErr);

								// Set assertions
								(vehicleLogDeleteRes.body._id).should.equal(vehicleLogSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Vehicle log instance if not signed in', function(done) {
		// Set Vehicle log user 
		vehicleLog.user = user;

		// Create new Vehicle log model instance
		var vehicleLogObj = new VehicleLog(vehicleLog);

		// Save the Vehicle log
		vehicleLogObj.save(function() {
			// Try deleting Vehicle log
			request(app).delete('/vehicle-logs/' + vehicleLogObj._id)
			.expect(401)
			.end(function(vehicleLogDeleteErr, vehicleLogDeleteRes) {
				// Set message assertion
				(vehicleLogDeleteRes.body.message).should.match('User is not logged in');

				// Handle Vehicle log error error
				done(vehicleLogDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		VehicleLog.remove().exec();
		done();
	});
});