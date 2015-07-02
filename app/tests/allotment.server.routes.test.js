'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Allotment = mongoose.model('Allotment'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, allotment;

/**
 * Allotment routes tests
 */
describe('Allotment CRUD tests', function() {
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

		// Save a user to the test db and create new Allotment
		user.save(function() {
			allotment = {
				name: 'Allotment Name'
			};

			done();
		});
	});

	it('should be able to save Allotment instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Allotment
				agent.post('/allotments')
					.send(allotment)
					.expect(200)
					.end(function(allotmentSaveErr, allotmentSaveRes) {
						// Handle Allotment save error
						if (allotmentSaveErr) done(allotmentSaveErr);

						// Get a list of Allotments
						agent.get('/allotments')
							.end(function(allotmentsGetErr, allotmentsGetRes) {
								// Handle Allotment save error
								if (allotmentsGetErr) done(allotmentsGetErr);

								// Get Allotments list
								var allotments = allotmentsGetRes.body;

								// Set assertions
								(allotments[0].user._id).should.equal(userId);
								(allotments[0].name).should.match('Allotment Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Allotment instance if not logged in', function(done) {
		agent.post('/allotments')
			.send(allotment)
			.expect(401)
			.end(function(allotmentSaveErr, allotmentSaveRes) {
				// Call the assertion callback
				done(allotmentSaveErr);
			});
	});

	it('should not be able to save Allotment instance if no name is provided', function(done) {
		// Invalidate name field
		allotment.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Allotment
				agent.post('/allotments')
					.send(allotment)
					.expect(400)
					.end(function(allotmentSaveErr, allotmentSaveRes) {
						// Set message assertion
						(allotmentSaveRes.body.message).should.match('Please fill Allotment name');
						
						// Handle Allotment save error
						done(allotmentSaveErr);
					});
			});
	});

	it('should be able to update Allotment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Allotment
				agent.post('/allotments')
					.send(allotment)
					.expect(200)
					.end(function(allotmentSaveErr, allotmentSaveRes) {
						// Handle Allotment save error
						if (allotmentSaveErr) done(allotmentSaveErr);

						// Update Allotment name
						allotment.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Allotment
						agent.put('/allotments/' + allotmentSaveRes.body._id)
							.send(allotment)
							.expect(200)
							.end(function(allotmentUpdateErr, allotmentUpdateRes) {
								// Handle Allotment update error
								if (allotmentUpdateErr) done(allotmentUpdateErr);

								// Set assertions
								(allotmentUpdateRes.body._id).should.equal(allotmentSaveRes.body._id);
								(allotmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Allotments if not signed in', function(done) {
		// Create new Allotment model instance
		var allotmentObj = new Allotment(allotment);

		// Save the Allotment
		allotmentObj.save(function() {
			// Request Allotments
			request(app).get('/allotments')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Allotment if not signed in', function(done) {
		// Create new Allotment model instance
		var allotmentObj = new Allotment(allotment);

		// Save the Allotment
		allotmentObj.save(function() {
			request(app).get('/allotments/' + allotmentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', allotment.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Allotment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Allotment
				agent.post('/allotments')
					.send(allotment)
					.expect(200)
					.end(function(allotmentSaveErr, allotmentSaveRes) {
						// Handle Allotment save error
						if (allotmentSaveErr) done(allotmentSaveErr);

						// Delete existing Allotment
						agent.delete('/allotments/' + allotmentSaveRes.body._id)
							.send(allotment)
							.expect(200)
							.end(function(allotmentDeleteErr, allotmentDeleteRes) {
								// Handle Allotment error error
								if (allotmentDeleteErr) done(allotmentDeleteErr);

								// Set assertions
								(allotmentDeleteRes.body._id).should.equal(allotmentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Allotment instance if not signed in', function(done) {
		// Set Allotment user 
		allotment.user = user;

		// Create new Allotment model instance
		var allotmentObj = new Allotment(allotment);

		// Save the Allotment
		allotmentObj.save(function() {
			// Try deleting Allotment
			request(app).delete('/allotments/' + allotmentObj._id)
			.expect(401)
			.end(function(allotmentDeleteErr, allotmentDeleteRes) {
				// Set message assertion
				(allotmentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Allotment error error
				done(allotmentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Allotment.remove().exec();
		done();
	});
});