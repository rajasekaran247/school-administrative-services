'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	HostelRoom = mongoose.model('HostelRoom'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, hostelRoom;

/**
 * Hostel room routes tests
 */
describe('Hostel room CRUD tests', function() {
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

		// Save a user to the test db and create new Hostel room
		user.save(function() {
			hostelRoom = {
				name: 'Hostel room Name'
			};

			done();
		});
	});

	it('should be able to save Hostel room instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel room
				agent.post('/hostel-rooms')
					.send(hostelRoom)
					.expect(200)
					.end(function(hostelRoomSaveErr, hostelRoomSaveRes) {
						// Handle Hostel room save error
						if (hostelRoomSaveErr) done(hostelRoomSaveErr);

						// Get a list of Hostel rooms
						agent.get('/hostel-rooms')
							.end(function(hostelRoomsGetErr, hostelRoomsGetRes) {
								// Handle Hostel room save error
								if (hostelRoomsGetErr) done(hostelRoomsGetErr);

								// Get Hostel rooms list
								var hostelRooms = hostelRoomsGetRes.body;

								// Set assertions
								(hostelRooms[0].user._id).should.equal(userId);
								(hostelRooms[0].name).should.match('Hostel room Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Hostel room instance if not logged in', function(done) {
		agent.post('/hostel-rooms')
			.send(hostelRoom)
			.expect(401)
			.end(function(hostelRoomSaveErr, hostelRoomSaveRes) {
				// Call the assertion callback
				done(hostelRoomSaveErr);
			});
	});

	it('should not be able to save Hostel room instance if no name is provided', function(done) {
		// Invalidate name field
		hostelRoom.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel room
				agent.post('/hostel-rooms')
					.send(hostelRoom)
					.expect(400)
					.end(function(hostelRoomSaveErr, hostelRoomSaveRes) {
						// Set message assertion
						(hostelRoomSaveRes.body.message).should.match('Please fill Hostel room name');
						
						// Handle Hostel room save error
						done(hostelRoomSaveErr);
					});
			});
	});

	it('should be able to update Hostel room instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel room
				agent.post('/hostel-rooms')
					.send(hostelRoom)
					.expect(200)
					.end(function(hostelRoomSaveErr, hostelRoomSaveRes) {
						// Handle Hostel room save error
						if (hostelRoomSaveErr) done(hostelRoomSaveErr);

						// Update Hostel room name
						hostelRoom.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Hostel room
						agent.put('/hostel-rooms/' + hostelRoomSaveRes.body._id)
							.send(hostelRoom)
							.expect(200)
							.end(function(hostelRoomUpdateErr, hostelRoomUpdateRes) {
								// Handle Hostel room update error
								if (hostelRoomUpdateErr) done(hostelRoomUpdateErr);

								// Set assertions
								(hostelRoomUpdateRes.body._id).should.equal(hostelRoomSaveRes.body._id);
								(hostelRoomUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Hostel rooms if not signed in', function(done) {
		// Create new Hostel room model instance
		var hostelRoomObj = new HostelRoom(hostelRoom);

		// Save the Hostel room
		hostelRoomObj.save(function() {
			// Request Hostel rooms
			request(app).get('/hostel-rooms')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Hostel room if not signed in', function(done) {
		// Create new Hostel room model instance
		var hostelRoomObj = new HostelRoom(hostelRoom);

		// Save the Hostel room
		hostelRoomObj.save(function() {
			request(app).get('/hostel-rooms/' + hostelRoomObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', hostelRoom.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Hostel room instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel room
				agent.post('/hostel-rooms')
					.send(hostelRoom)
					.expect(200)
					.end(function(hostelRoomSaveErr, hostelRoomSaveRes) {
						// Handle Hostel room save error
						if (hostelRoomSaveErr) done(hostelRoomSaveErr);

						// Delete existing Hostel room
						agent.delete('/hostel-rooms/' + hostelRoomSaveRes.body._id)
							.send(hostelRoom)
							.expect(200)
							.end(function(hostelRoomDeleteErr, hostelRoomDeleteRes) {
								// Handle Hostel room error error
								if (hostelRoomDeleteErr) done(hostelRoomDeleteErr);

								// Set assertions
								(hostelRoomDeleteRes.body._id).should.equal(hostelRoomSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Hostel room instance if not signed in', function(done) {
		// Set Hostel room user 
		hostelRoom.user = user;

		// Create new Hostel room model instance
		var hostelRoomObj = new HostelRoom(hostelRoom);

		// Save the Hostel room
		hostelRoomObj.save(function() {
			// Try deleting Hostel room
			request(app).delete('/hostel-rooms/' + hostelRoomObj._id)
			.expect(401)
			.end(function(hostelRoomDeleteErr, hostelRoomDeleteRes) {
				// Set message assertion
				(hostelRoomDeleteRes.body.message).should.match('User is not logged in');

				// Handle Hostel room error error
				done(hostelRoomDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		HostelRoom.remove().exec();
		done();
	});
});