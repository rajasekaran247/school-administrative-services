'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RoomRequest = mongoose.model('RoomRequest'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, roomRequest;

/**
 * Room request routes tests
 */
describe('Room request CRUD tests', function() {
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

		// Save a user to the test db and create new Room request
		user.save(function() {
			roomRequest = {
				name: 'Room request Name'
			};

			done();
		});
	});

	it('should be able to save Room request instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Room request
				agent.post('/room-requests')
					.send(roomRequest)
					.expect(200)
					.end(function(roomRequestSaveErr, roomRequestSaveRes) {
						// Handle Room request save error
						if (roomRequestSaveErr) done(roomRequestSaveErr);

						// Get a list of Room requests
						agent.get('/room-requests')
							.end(function(roomRequestsGetErr, roomRequestsGetRes) {
								// Handle Room request save error
								if (roomRequestsGetErr) done(roomRequestsGetErr);

								// Get Room requests list
								var roomRequests = roomRequestsGetRes.body;

								// Set assertions
								(roomRequests[0].user._id).should.equal(userId);
								(roomRequests[0].name).should.match('Room request Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Room request instance if not logged in', function(done) {
		agent.post('/room-requests')
			.send(roomRequest)
			.expect(401)
			.end(function(roomRequestSaveErr, roomRequestSaveRes) {
				// Call the assertion callback
				done(roomRequestSaveErr);
			});
	});

	it('should not be able to save Room request instance if no name is provided', function(done) {
		// Invalidate name field
		roomRequest.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Room request
				agent.post('/room-requests')
					.send(roomRequest)
					.expect(400)
					.end(function(roomRequestSaveErr, roomRequestSaveRes) {
						// Set message assertion
						(roomRequestSaveRes.body.message).should.match('Please fill Room request name');
						
						// Handle Room request save error
						done(roomRequestSaveErr);
					});
			});
	});

	it('should be able to update Room request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Room request
				agent.post('/room-requests')
					.send(roomRequest)
					.expect(200)
					.end(function(roomRequestSaveErr, roomRequestSaveRes) {
						// Handle Room request save error
						if (roomRequestSaveErr) done(roomRequestSaveErr);

						// Update Room request name
						roomRequest.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Room request
						agent.put('/room-requests/' + roomRequestSaveRes.body._id)
							.send(roomRequest)
							.expect(200)
							.end(function(roomRequestUpdateErr, roomRequestUpdateRes) {
								// Handle Room request update error
								if (roomRequestUpdateErr) done(roomRequestUpdateErr);

								// Set assertions
								(roomRequestUpdateRes.body._id).should.equal(roomRequestSaveRes.body._id);
								(roomRequestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Room requests if not signed in', function(done) {
		// Create new Room request model instance
		var roomRequestObj = new RoomRequest(roomRequest);

		// Save the Room request
		roomRequestObj.save(function() {
			// Request Room requests
			request(app).get('/room-requests')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Room request if not signed in', function(done) {
		// Create new Room request model instance
		var roomRequestObj = new RoomRequest(roomRequest);

		// Save the Room request
		roomRequestObj.save(function() {
			request(app).get('/room-requests/' + roomRequestObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', roomRequest.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Room request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Room request
				agent.post('/room-requests')
					.send(roomRequest)
					.expect(200)
					.end(function(roomRequestSaveErr, roomRequestSaveRes) {
						// Handle Room request save error
						if (roomRequestSaveErr) done(roomRequestSaveErr);

						// Delete existing Room request
						agent.delete('/room-requests/' + roomRequestSaveRes.body._id)
							.send(roomRequest)
							.expect(200)
							.end(function(roomRequestDeleteErr, roomRequestDeleteRes) {
								// Handle Room request error error
								if (roomRequestDeleteErr) done(roomRequestDeleteErr);

								// Set assertions
								(roomRequestDeleteRes.body._id).should.equal(roomRequestSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Room request instance if not signed in', function(done) {
		// Set Room request user 
		roomRequest.user = user;

		// Create new Room request model instance
		var roomRequestObj = new RoomRequest(roomRequest);

		// Save the Room request
		roomRequestObj.save(function() {
			// Try deleting Room request
			request(app).delete('/room-requests/' + roomRequestObj._id)
			.expect(401)
			.end(function(roomRequestDeleteErr, roomRequestDeleteRes) {
				// Set message assertion
				(roomRequestDeleteRes.body.message).should.match('User is not logged in');

				// Handle Room request error error
				done(roomRequestDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		RoomRequest.remove().exec();
		done();
	});
});