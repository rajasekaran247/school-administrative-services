'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	AdmissionApplication = mongoose.model('AdmissionApplication'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, admissionApplication;

/**
 * Admission application routes tests
 */
describe('Admission application CRUD tests', function() {
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

		// Save a user to the test db and create new Admission application
		user.save(function() {
			admissionApplication = {
				name: 'Admission application Name'
			};

			done();
		});
	});

	it('should be able to save Admission application instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admission application
				agent.post('/admission-applications')
					.send(admissionApplication)
					.expect(200)
					.end(function(admissionApplicationSaveErr, admissionApplicationSaveRes) {
						// Handle Admission application save error
						if (admissionApplicationSaveErr) done(admissionApplicationSaveErr);

						// Get a list of Admission applications
						agent.get('/admission-applications')
							.end(function(admissionApplicationsGetErr, admissionApplicationsGetRes) {
								// Handle Admission application save error
								if (admissionApplicationsGetErr) done(admissionApplicationsGetErr);

								// Get Admission applications list
								var admissionApplications = admissionApplicationsGetRes.body;

								// Set assertions
								(admissionApplications[0].user._id).should.equal(userId);
								(admissionApplications[0].name).should.match('Admission application Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Admission application instance if not logged in', function(done) {
		agent.post('/admission-applications')
			.send(admissionApplication)
			.expect(401)
			.end(function(admissionApplicationSaveErr, admissionApplicationSaveRes) {
				// Call the assertion callback
				done(admissionApplicationSaveErr);
			});
	});

	it('should not be able to save Admission application instance if no name is provided', function(done) {
		// Invalidate name field
		admissionApplication.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admission application
				agent.post('/admission-applications')
					.send(admissionApplication)
					.expect(400)
					.end(function(admissionApplicationSaveErr, admissionApplicationSaveRes) {
						// Set message assertion
						(admissionApplicationSaveRes.body.message).should.match('Please fill Admission application name');
						
						// Handle Admission application save error
						done(admissionApplicationSaveErr);
					});
			});
	});

	it('should be able to update Admission application instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admission application
				agent.post('/admission-applications')
					.send(admissionApplication)
					.expect(200)
					.end(function(admissionApplicationSaveErr, admissionApplicationSaveRes) {
						// Handle Admission application save error
						if (admissionApplicationSaveErr) done(admissionApplicationSaveErr);

						// Update Admission application name
						admissionApplication.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Admission application
						agent.put('/admission-applications/' + admissionApplicationSaveRes.body._id)
							.send(admissionApplication)
							.expect(200)
							.end(function(admissionApplicationUpdateErr, admissionApplicationUpdateRes) {
								// Handle Admission application update error
								if (admissionApplicationUpdateErr) done(admissionApplicationUpdateErr);

								// Set assertions
								(admissionApplicationUpdateRes.body._id).should.equal(admissionApplicationSaveRes.body._id);
								(admissionApplicationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Admission applications if not signed in', function(done) {
		// Create new Admission application model instance
		var admissionApplicationObj = new AdmissionApplication(admissionApplication);

		// Save the Admission application
		admissionApplicationObj.save(function() {
			// Request Admission applications
			request(app).get('/admission-applications')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Admission application if not signed in', function(done) {
		// Create new Admission application model instance
		var admissionApplicationObj = new AdmissionApplication(admissionApplication);

		// Save the Admission application
		admissionApplicationObj.save(function() {
			request(app).get('/admission-applications/' + admissionApplicationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', admissionApplication.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Admission application instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admission application
				agent.post('/admission-applications')
					.send(admissionApplication)
					.expect(200)
					.end(function(admissionApplicationSaveErr, admissionApplicationSaveRes) {
						// Handle Admission application save error
						if (admissionApplicationSaveErr) done(admissionApplicationSaveErr);

						// Delete existing Admission application
						agent.delete('/admission-applications/' + admissionApplicationSaveRes.body._id)
							.send(admissionApplication)
							.expect(200)
							.end(function(admissionApplicationDeleteErr, admissionApplicationDeleteRes) {
								// Handle Admission application error error
								if (admissionApplicationDeleteErr) done(admissionApplicationDeleteErr);

								// Set assertions
								(admissionApplicationDeleteRes.body._id).should.equal(admissionApplicationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Admission application instance if not signed in', function(done) {
		// Set Admission application user 
		admissionApplication.user = user;

		// Create new Admission application model instance
		var admissionApplicationObj = new AdmissionApplication(admissionApplication);

		// Save the Admission application
		admissionApplicationObj.save(function() {
			// Try deleting Admission application
			request(app).delete('/admission-applications/' + admissionApplicationObj._id)
			.expect(401)
			.end(function(admissionApplicationDeleteErr, admissionApplicationDeleteRes) {
				// Set message assertion
				(admissionApplicationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Admission application error error
				done(admissionApplicationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		AdmissionApplication.remove().exec();
		done();
	});
});