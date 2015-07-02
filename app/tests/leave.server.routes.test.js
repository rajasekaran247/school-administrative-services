'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Leave = mongoose.model('Leave'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, leave;

/**
 * Leave routes tests
 */
describe('Leave CRUD tests', function() {
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

		// Save a user to the test db and create new Leave
		user.save(function() {
			leave = {
				name: 'Leave Name'
			};

			done();
		});
	});

	it('should be able to save Leave instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Leave
				agent.post('/leaves')
					.send(leave)
					.expect(200)
					.end(function(leaveSaveErr, leaveSaveRes) {
						// Handle Leave save error
						if (leaveSaveErr) done(leaveSaveErr);

						// Get a list of Leaves
						agent.get('/leaves')
							.end(function(leavesGetErr, leavesGetRes) {
								// Handle Leave save error
								if (leavesGetErr) done(leavesGetErr);

								// Get Leaves list
								var leaves = leavesGetRes.body;

								// Set assertions
								(leaves[0].user._id).should.equal(userId);
								(leaves[0].name).should.match('Leave Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Leave instance if not logged in', function(done) {
		agent.post('/leaves')
			.send(leave)
			.expect(401)
			.end(function(leaveSaveErr, leaveSaveRes) {
				// Call the assertion callback
				done(leaveSaveErr);
			});
	});

	it('should not be able to save Leave instance if no name is provided', function(done) {
		// Invalidate name field
		leave.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Leave
				agent.post('/leaves')
					.send(leave)
					.expect(400)
					.end(function(leaveSaveErr, leaveSaveRes) {
						// Set message assertion
						(leaveSaveRes.body.message).should.match('Please fill Leave name');
						
						// Handle Leave save error
						done(leaveSaveErr);
					});
			});
	});

	it('should be able to update Leave instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Leave
				agent.post('/leaves')
					.send(leave)
					.expect(200)
					.end(function(leaveSaveErr, leaveSaveRes) {
						// Handle Leave save error
						if (leaveSaveErr) done(leaveSaveErr);

						// Update Leave name
						leave.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Leave
						agent.put('/leaves/' + leaveSaveRes.body._id)
							.send(leave)
							.expect(200)
							.end(function(leaveUpdateErr, leaveUpdateRes) {
								// Handle Leave update error
								if (leaveUpdateErr) done(leaveUpdateErr);

								// Set assertions
								(leaveUpdateRes.body._id).should.equal(leaveSaveRes.body._id);
								(leaveUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Leaves if not signed in', function(done) {
		// Create new Leave model instance
		var leaveObj = new Leave(leave);

		// Save the Leave
		leaveObj.save(function() {
			// Request Leaves
			request(app).get('/leaves')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Leave if not signed in', function(done) {
		// Create new Leave model instance
		var leaveObj = new Leave(leave);

		// Save the Leave
		leaveObj.save(function() {
			request(app).get('/leaves/' + leaveObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', leave.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Leave instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Leave
				agent.post('/leaves')
					.send(leave)
					.expect(200)
					.end(function(leaveSaveErr, leaveSaveRes) {
						// Handle Leave save error
						if (leaveSaveErr) done(leaveSaveErr);

						// Delete existing Leave
						agent.delete('/leaves/' + leaveSaveRes.body._id)
							.send(leave)
							.expect(200)
							.end(function(leaveDeleteErr, leaveDeleteRes) {
								// Handle Leave error error
								if (leaveDeleteErr) done(leaveDeleteErr);

								// Set assertions
								(leaveDeleteRes.body._id).should.equal(leaveSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Leave instance if not signed in', function(done) {
		// Set Leave user 
		leave.user = user;

		// Create new Leave model instance
		var leaveObj = new Leave(leave);

		// Save the Leave
		leaveObj.save(function() {
			// Try deleting Leave
			request(app).delete('/leaves/' + leaveObj._id)
			.expect(401)
			.end(function(leaveDeleteErr, leaveDeleteRes) {
				// Set message assertion
				(leaveDeleteRes.body.message).should.match('User is not logged in');

				// Handle Leave error error
				done(leaveDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Leave.remove().exec();
		done();
	});
});