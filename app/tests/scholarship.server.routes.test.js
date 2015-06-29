'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Scholarship = mongoose.model('Scholarship'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, scholarship;

/**
 * Scholarship routes tests
 */
describe('Scholarship CRUD tests', function() {
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

		// Save a user to the test db and create new Scholarship
		user.save(function() {
			scholarship = {
				name: 'Scholarship Name'
			};

			done();
		});
	});

	it('should be able to save Scholarship instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Scholarship
				agent.post('/scholarships')
					.send(scholarship)
					.expect(200)
					.end(function(scholarshipSaveErr, scholarshipSaveRes) {
						// Handle Scholarship save error
						if (scholarshipSaveErr) done(scholarshipSaveErr);

						// Get a list of Scholarships
						agent.get('/scholarships')
							.end(function(scholarshipsGetErr, scholarshipsGetRes) {
								// Handle Scholarship save error
								if (scholarshipsGetErr) done(scholarshipsGetErr);

								// Get Scholarships list
								var scholarships = scholarshipsGetRes.body;

								// Set assertions
								(scholarships[0].user._id).should.equal(userId);
								(scholarships[0].name).should.match('Scholarship Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Scholarship instance if not logged in', function(done) {
		agent.post('/scholarships')
			.send(scholarship)
			.expect(401)
			.end(function(scholarshipSaveErr, scholarshipSaveRes) {
				// Call the assertion callback
				done(scholarshipSaveErr);
			});
	});

	it('should not be able to save Scholarship instance if no name is provided', function(done) {
		// Invalidate name field
		scholarship.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Scholarship
				agent.post('/scholarships')
					.send(scholarship)
					.expect(400)
					.end(function(scholarshipSaveErr, scholarshipSaveRes) {
						// Set message assertion
						(scholarshipSaveRes.body.message).should.match('Please fill Scholarship name');
						
						// Handle Scholarship save error
						done(scholarshipSaveErr);
					});
			});
	});

	it('should be able to update Scholarship instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Scholarship
				agent.post('/scholarships')
					.send(scholarship)
					.expect(200)
					.end(function(scholarshipSaveErr, scholarshipSaveRes) {
						// Handle Scholarship save error
						if (scholarshipSaveErr) done(scholarshipSaveErr);

						// Update Scholarship name
						scholarship.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Scholarship
						agent.put('/scholarships/' + scholarshipSaveRes.body._id)
							.send(scholarship)
							.expect(200)
							.end(function(scholarshipUpdateErr, scholarshipUpdateRes) {
								// Handle Scholarship update error
								if (scholarshipUpdateErr) done(scholarshipUpdateErr);

								// Set assertions
								(scholarshipUpdateRes.body._id).should.equal(scholarshipSaveRes.body._id);
								(scholarshipUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Scholarships if not signed in', function(done) {
		// Create new Scholarship model instance
		var scholarshipObj = new Scholarship(scholarship);

		// Save the Scholarship
		scholarshipObj.save(function() {
			// Request Scholarships
			request(app).get('/scholarships')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Scholarship if not signed in', function(done) {
		// Create new Scholarship model instance
		var scholarshipObj = new Scholarship(scholarship);

		// Save the Scholarship
		scholarshipObj.save(function() {
			request(app).get('/scholarships/' + scholarshipObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', scholarship.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Scholarship instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Scholarship
				agent.post('/scholarships')
					.send(scholarship)
					.expect(200)
					.end(function(scholarshipSaveErr, scholarshipSaveRes) {
						// Handle Scholarship save error
						if (scholarshipSaveErr) done(scholarshipSaveErr);

						// Delete existing Scholarship
						agent.delete('/scholarships/' + scholarshipSaveRes.body._id)
							.send(scholarship)
							.expect(200)
							.end(function(scholarshipDeleteErr, scholarshipDeleteRes) {
								// Handle Scholarship error error
								if (scholarshipDeleteErr) done(scholarshipDeleteErr);

								// Set assertions
								(scholarshipDeleteRes.body._id).should.equal(scholarshipSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Scholarship instance if not signed in', function(done) {
		// Set Scholarship user 
		scholarship.user = user;

		// Create new Scholarship model instance
		var scholarshipObj = new Scholarship(scholarship);

		// Save the Scholarship
		scholarshipObj.save(function() {
			// Try deleting Scholarship
			request(app).delete('/scholarships/' + scholarshipObj._id)
			.expect(401)
			.end(function(scholarshipDeleteErr, scholarshipDeleteRes) {
				// Set message assertion
				(scholarshipDeleteRes.body.message).should.match('User is not logged in');

				// Handle Scholarship error error
				done(scholarshipDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Scholarship.remove().exec();
		done();
	});
});