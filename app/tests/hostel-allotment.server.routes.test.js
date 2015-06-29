'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	HostelAllotment = mongoose.model('HostelAllotment'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, hostelAllotment;

/**
 * Hostel allotment routes tests
 */
describe('Hostel allotment CRUD tests', function() {
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

		// Save a user to the test db and create new Hostel allotment
		user.save(function() {
			hostelAllotment = {
				name: 'Hostel allotment Name'
			};

			done();
		});
	});

	it('should be able to save Hostel allotment instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel allotment
				agent.post('/hostel-allotments')
					.send(hostelAllotment)
					.expect(200)
					.end(function(hostelAllotmentSaveErr, hostelAllotmentSaveRes) {
						// Handle Hostel allotment save error
						if (hostelAllotmentSaveErr) done(hostelAllotmentSaveErr);

						// Get a list of Hostel allotments
						agent.get('/hostel-allotments')
							.end(function(hostelAllotmentsGetErr, hostelAllotmentsGetRes) {
								// Handle Hostel allotment save error
								if (hostelAllotmentsGetErr) done(hostelAllotmentsGetErr);

								// Get Hostel allotments list
								var hostelAllotments = hostelAllotmentsGetRes.body;

								// Set assertions
								(hostelAllotments[0].user._id).should.equal(userId);
								(hostelAllotments[0].name).should.match('Hostel allotment Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Hostel allotment instance if not logged in', function(done) {
		agent.post('/hostel-allotments')
			.send(hostelAllotment)
			.expect(401)
			.end(function(hostelAllotmentSaveErr, hostelAllotmentSaveRes) {
				// Call the assertion callback
				done(hostelAllotmentSaveErr);
			});
	});

	it('should not be able to save Hostel allotment instance if no name is provided', function(done) {
		// Invalidate name field
		hostelAllotment.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel allotment
				agent.post('/hostel-allotments')
					.send(hostelAllotment)
					.expect(400)
					.end(function(hostelAllotmentSaveErr, hostelAllotmentSaveRes) {
						// Set message assertion
						(hostelAllotmentSaveRes.body.message).should.match('Please fill Hostel allotment name');
						
						// Handle Hostel allotment save error
						done(hostelAllotmentSaveErr);
					});
			});
	});

	it('should be able to update Hostel allotment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel allotment
				agent.post('/hostel-allotments')
					.send(hostelAllotment)
					.expect(200)
					.end(function(hostelAllotmentSaveErr, hostelAllotmentSaveRes) {
						// Handle Hostel allotment save error
						if (hostelAllotmentSaveErr) done(hostelAllotmentSaveErr);

						// Update Hostel allotment name
						hostelAllotment.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Hostel allotment
						agent.put('/hostel-allotments/' + hostelAllotmentSaveRes.body._id)
							.send(hostelAllotment)
							.expect(200)
							.end(function(hostelAllotmentUpdateErr, hostelAllotmentUpdateRes) {
								// Handle Hostel allotment update error
								if (hostelAllotmentUpdateErr) done(hostelAllotmentUpdateErr);

								// Set assertions
								(hostelAllotmentUpdateRes.body._id).should.equal(hostelAllotmentSaveRes.body._id);
								(hostelAllotmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Hostel allotments if not signed in', function(done) {
		// Create new Hostel allotment model instance
		var hostelAllotmentObj = new HostelAllotment(hostelAllotment);

		// Save the Hostel allotment
		hostelAllotmentObj.save(function() {
			// Request Hostel allotments
			request(app).get('/hostel-allotments')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Hostel allotment if not signed in', function(done) {
		// Create new Hostel allotment model instance
		var hostelAllotmentObj = new HostelAllotment(hostelAllotment);

		// Save the Hostel allotment
		hostelAllotmentObj.save(function() {
			request(app).get('/hostel-allotments/' + hostelAllotmentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', hostelAllotment.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Hostel allotment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hostel allotment
				agent.post('/hostel-allotments')
					.send(hostelAllotment)
					.expect(200)
					.end(function(hostelAllotmentSaveErr, hostelAllotmentSaveRes) {
						// Handle Hostel allotment save error
						if (hostelAllotmentSaveErr) done(hostelAllotmentSaveErr);

						// Delete existing Hostel allotment
						agent.delete('/hostel-allotments/' + hostelAllotmentSaveRes.body._id)
							.send(hostelAllotment)
							.expect(200)
							.end(function(hostelAllotmentDeleteErr, hostelAllotmentDeleteRes) {
								// Handle Hostel allotment error error
								if (hostelAllotmentDeleteErr) done(hostelAllotmentDeleteErr);

								// Set assertions
								(hostelAllotmentDeleteRes.body._id).should.equal(hostelAllotmentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Hostel allotment instance if not signed in', function(done) {
		// Set Hostel allotment user 
		hostelAllotment.user = user;

		// Create new Hostel allotment model instance
		var hostelAllotmentObj = new HostelAllotment(hostelAllotment);

		// Save the Hostel allotment
		hostelAllotmentObj.save(function() {
			// Try deleting Hostel allotment
			request(app).delete('/hostel-allotments/' + hostelAllotmentObj._id)
			.expect(401)
			.end(function(hostelAllotmentDeleteErr, hostelAllotmentDeleteRes) {
				// Set message assertion
				(hostelAllotmentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Hostel allotment error error
				done(hostelAllotmentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		HostelAllotment.remove().exec();
		done();
	});
});