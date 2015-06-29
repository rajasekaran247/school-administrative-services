'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateRegister = mongoose.model('GateRegister'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gateRegister;

/**
 * Gate register routes tests
 */
describe('Gate register CRUD tests', function() {
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

		// Save a user to the test db and create new Gate register
		user.save(function() {
			gateRegister = {
				name: 'Gate register Name'
			};

			done();
		});
	});

	it('should be able to save Gate register instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate register
				agent.post('/gate-registers')
					.send(gateRegister)
					.expect(200)
					.end(function(gateRegisterSaveErr, gateRegisterSaveRes) {
						// Handle Gate register save error
						if (gateRegisterSaveErr) done(gateRegisterSaveErr);

						// Get a list of Gate registers
						agent.get('/gate-registers')
							.end(function(gateRegistersGetErr, gateRegistersGetRes) {
								// Handle Gate register save error
								if (gateRegistersGetErr) done(gateRegistersGetErr);

								// Get Gate registers list
								var gateRegisters = gateRegistersGetRes.body;

								// Set assertions
								(gateRegisters[0].user._id).should.equal(userId);
								(gateRegisters[0].name).should.match('Gate register Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gate register instance if not logged in', function(done) {
		agent.post('/gate-registers')
			.send(gateRegister)
			.expect(401)
			.end(function(gateRegisterSaveErr, gateRegisterSaveRes) {
				// Call the assertion callback
				done(gateRegisterSaveErr);
			});
	});

	it('should not be able to save Gate register instance if no name is provided', function(done) {
		// Invalidate name field
		gateRegister.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate register
				agent.post('/gate-registers')
					.send(gateRegister)
					.expect(400)
					.end(function(gateRegisterSaveErr, gateRegisterSaveRes) {
						// Set message assertion
						(gateRegisterSaveRes.body.message).should.match('Please fill Gate register name');
						
						// Handle Gate register save error
						done(gateRegisterSaveErr);
					});
			});
	});

	it('should be able to update Gate register instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate register
				agent.post('/gate-registers')
					.send(gateRegister)
					.expect(200)
					.end(function(gateRegisterSaveErr, gateRegisterSaveRes) {
						// Handle Gate register save error
						if (gateRegisterSaveErr) done(gateRegisterSaveErr);

						// Update Gate register name
						gateRegister.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gate register
						agent.put('/gate-registers/' + gateRegisterSaveRes.body._id)
							.send(gateRegister)
							.expect(200)
							.end(function(gateRegisterUpdateErr, gateRegisterUpdateRes) {
								// Handle Gate register update error
								if (gateRegisterUpdateErr) done(gateRegisterUpdateErr);

								// Set assertions
								(gateRegisterUpdateRes.body._id).should.equal(gateRegisterSaveRes.body._id);
								(gateRegisterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gate registers if not signed in', function(done) {
		// Create new Gate register model instance
		var gateRegisterObj = new GateRegister(gateRegister);

		// Save the Gate register
		gateRegisterObj.save(function() {
			// Request Gate registers
			request(app).get('/gate-registers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gate register if not signed in', function(done) {
		// Create new Gate register model instance
		var gateRegisterObj = new GateRegister(gateRegister);

		// Save the Gate register
		gateRegisterObj.save(function() {
			request(app).get('/gate-registers/' + gateRegisterObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gateRegister.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gate register instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate register
				agent.post('/gate-registers')
					.send(gateRegister)
					.expect(200)
					.end(function(gateRegisterSaveErr, gateRegisterSaveRes) {
						// Handle Gate register save error
						if (gateRegisterSaveErr) done(gateRegisterSaveErr);

						// Delete existing Gate register
						agent.delete('/gate-registers/' + gateRegisterSaveRes.body._id)
							.send(gateRegister)
							.expect(200)
							.end(function(gateRegisterDeleteErr, gateRegisterDeleteRes) {
								// Handle Gate register error error
								if (gateRegisterDeleteErr) done(gateRegisterDeleteErr);

								// Set assertions
								(gateRegisterDeleteRes.body._id).should.equal(gateRegisterSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gate register instance if not signed in', function(done) {
		// Set Gate register user 
		gateRegister.user = user;

		// Create new Gate register model instance
		var gateRegisterObj = new GateRegister(gateRegister);

		// Save the Gate register
		gateRegisterObj.save(function() {
			// Try deleting Gate register
			request(app).delete('/gate-registers/' + gateRegisterObj._id)
			.expect(401)
			.end(function(gateRegisterDeleteErr, gateRegisterDeleteRes) {
				// Set message assertion
				(gateRegisterDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gate register error error
				done(gateRegisterDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		GateRegister.remove().exec();
		done();
	});
});