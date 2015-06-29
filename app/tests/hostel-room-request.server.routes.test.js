'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	HostelRoomRequest = mongoose.model('HostelRoomRequest'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, hostelRoomRequest;

/**
 * Hostel room request routes tests
 */
describe('Hostel room request CRUD tests', function() {
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

		// Save a user to the test db and create new Hostel room request
		user.save(function() {
			hostelRoomRequest = {
				name: 'Hostel room request Name'
			};

			done();
		});
	});

	it('should be able to save Hostel room request instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel room request
				agent.post('/hostel-room-requests')
					.send(hostelRoomRequest)
					.expect(200)
					.end(function(hostelRoomRequestSaveErr, hostelRoomRequestSaveRes) {
						// Handle Hostel room request save error
						if (hostelRoomRequestSaveErr) done(hostelRoomRequestSaveErr);

						// Get a list of Hostel room requests
						agent.get('/hostel-room-requests')
							.end(function(hostelRoomRequestsGetErr, hostelRoomRequestsGetRes) {
								// Handle Hostel room request save error
								if (hostelRoomRequestsGetErr) done(hostelRoomRequestsGetErr);

								// Get Hostel room requests list
								var hostelRoomRequests = hostelRoomRequestsGetRes.body;

								// Set assertions
								(hostelRoomRequests[0].user._id).should.equal(userId);
								(hostelRoomRequests[0].name).should.match('Hostel room request Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Hostel room request instance if not logged in', function(done) {
		agent.post('/hostel-room-requests')
			.send(hostelRoomRequest)
			.expect(401)
			.end(function(hostelRoomRequestSaveErr, hostelRoomRequestSaveRes) {
				// Call the assertion callback
				done(hostelRoomRequestSaveErr);
			});
	});

	it('should not be able to save Hostel room request instance if no name is provided', function(done) {
		// Invalidate name field
		hostelRoomRequest.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel room request
				agent.post('/hostel-room-requests')
					.send(hostelRoomRequest)
					.expect(400)
					.end(function(hostelRoomRequestSaveErr, hostelRoomRequestSaveRes) {
						// Set message assertion
						(hostelRoomRequestSaveRes.body.message).should.match('Please fill Hostel room request name');
						
						// Handle Hostel room request save error
						done(hostelRoomRequestSaveErr);
					});
			});
	});

	it('should be able to update Hostel room request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel room request
				agent.post('/hostel-room-requests')
					.send(hostelRoomRequest)
					.expect(200)
					.end(function(hostelRoomRequestSaveErr, hostelRoomRequestSaveRes) {
						// Handle Hostel room request save error
						if (hostelRoomRequestSaveErr) done(hostelRoomRequestSaveErr);

						// Update Hostel room request name
						hostelRoomRequest.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Hostel room request
						agent.put('/hostel-room-requests/' + hostelRoomRequestSaveRes.body._id)
							.send(hostelRoomRequest)
							.expect(200)
							.end(function(hostelRoomRequestUpdateErr, hostelRoomRequestUpdateRes) {
								// Handle Hostel room request update error
								if (hostelRoomRequestUpdateErr) done(hostelRoomRequestUpdateErr);

								// Set assertions
								(hostelRoomRequestUpdateRes.body._id).should.equal(hostelRoomRequestSaveRes.body._id);
								(hostelRoomRequestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Hostel room requests if not signed in', function(done) {
		// Create new Hostel room request model instance
		var hostelRoomRequestObj = new HostelRoomRequest(hostelRoomRequest);

		// Save the Hostel room request
		hostelRoomRequestObj.save(function() {
			// Request Hostel room requests
			request(app).get('/hostel-room-requests')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Hostel room request if not signed in', function(done) {
		// Create new Hostel room request model instance
		var hostelRoomRequestObj = new HostelRoomRequest(hostelRoomRequest);

		// Save the Hostel room request
		hostelRoomRequestObj.save(function() {
			request(app).get('/hostel-room-requests/' + hostelRoomRequestObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', hostelRoomRequest.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Hostel room request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel room request
				agent.post('/hostel-room-requests')
					.send(hostelRoomRequest)
					.expect(200)
					.end(function(hostelRoomRequestSaveErr, hostelRoomRequestSaveRes) {
						// Handle Hostel room request save error
						if (hostelRoomRequestSaveErr) done(hostelRoomRequestSaveErr);

						// Delete existing Hostel room request
						agent.delete('/hostel-room-requests/' + hostelRoomRequestSaveRes.body._id)
							.send(hostelRoomRequest)
							.expect(200)
							.end(function(hostelRoomRequestDeleteErr, hostelRoomRequestDeleteRes) {
								// Handle Hostel room request error error
								if (hostelRoomRequestDeleteErr) done(hostelRoomRequestDeleteErr);

								// Set assertions
								(hostelRoomRequestDeleteRes.body._id).should.equal(hostelRoomRequestSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Hostel room request instance if not signed in', function(done) {
		// Set Hostel room request user 
		hostelRoomRequest.user = user;

		// Create new Hostel room request model instance
		var hostelRoomRequestObj = new HostelRoomRequest(hostelRoomRequest);

		// Save the Hostel room request
		hostelRoomRequestObj.save(function() {
			// Try deleting Hostel room request
			request(app).delete('/hostel-room-requests/' + hostelRoomRequestObj._id)
			.expect(401)
			.end(function(hostelRoomRequestDeleteErr, hostelRoomRequestDeleteRes) {
				// Set message assertion
				(hostelRoomRequestDeleteRes.body.message).should.match('User is not logged in');

				// Handle Hostel room request error error
				done(hostelRoomRequestDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		HostelRoomRequest.remove().exec();
		done();
	});
});