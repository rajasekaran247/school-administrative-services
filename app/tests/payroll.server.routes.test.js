'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Payroll = mongoose.model('Payroll'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, payroll;

/**
 * Payroll routes tests
 */
describe('Payroll CRUD tests', function() {
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

		// Save a user to the test db and create new Payroll
		user.save(function() {
			payroll = {
				name: 'Payroll Name'
			};

			done();
		});
	});

	it('should be able to save Payroll instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Payroll
				agent.post('/payrolls')
					.send(payroll)
					.expect(200)
					.end(function(payrollSaveErr, payrollSaveRes) {
						// Handle Payroll save error
						if (payrollSaveErr) done(payrollSaveErr);

						// Get a list of Payrolls
						agent.get('/payrolls')
							.end(function(payrollsGetErr, payrollsGetRes) {
								// Handle Payroll save error
								if (payrollsGetErr) done(payrollsGetErr);

								// Get Payrolls list
								var payrolls = payrollsGetRes.body;

								// Set assertions
								(payrolls[0].user._id).should.equal(userId);
								(payrolls[0].name).should.match('Payroll Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Payroll instance if not logged in', function(done) {
		agent.post('/payrolls')
			.send(payroll)
			.expect(401)
			.end(function(payrollSaveErr, payrollSaveRes) {
				// Call the assertion callback
				done(payrollSaveErr);
			});
	});

	it('should not be able to save Payroll instance if no name is provided', function(done) {
		// Invalidate name field
		payroll.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Payroll
				agent.post('/payrolls')
					.send(payroll)
					.expect(400)
					.end(function(payrollSaveErr, payrollSaveRes) {
						// Set message assertion
						(payrollSaveRes.body.message).should.match('Please fill Payroll name');
						
						// Handle Payroll save error
						done(payrollSaveErr);
					});
			});
	});

	it('should be able to update Payroll instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Payroll
				agent.post('/payrolls')
					.send(payroll)
					.expect(200)
					.end(function(payrollSaveErr, payrollSaveRes) {
						// Handle Payroll save error
						if (payrollSaveErr) done(payrollSaveErr);

						// Update Payroll name
						payroll.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Payroll
						agent.put('/payrolls/' + payrollSaveRes.body._id)
							.send(payroll)
							.expect(200)
							.end(function(payrollUpdateErr, payrollUpdateRes) {
								// Handle Payroll update error
								if (payrollUpdateErr) done(payrollUpdateErr);

								// Set assertions
								(payrollUpdateRes.body._id).should.equal(payrollSaveRes.body._id);
								(payrollUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Payrolls if not signed in', function(done) {
		// Create new Payroll model instance
		var payrollObj = new Payroll(payroll);

		// Save the Payroll
		payrollObj.save(function() {
			// Request Payrolls
			request(app).get('/payrolls')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Payroll if not signed in', function(done) {
		// Create new Payroll model instance
		var payrollObj = new Payroll(payroll);

		// Save the Payroll
		payrollObj.save(function() {
			request(app).get('/payrolls/' + payrollObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', payroll.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Payroll instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Payroll
				agent.post('/payrolls')
					.send(payroll)
					.expect(200)
					.end(function(payrollSaveErr, payrollSaveRes) {
						// Handle Payroll save error
						if (payrollSaveErr) done(payrollSaveErr);

						// Delete existing Payroll
						agent.delete('/payrolls/' + payrollSaveRes.body._id)
							.send(payroll)
							.expect(200)
							.end(function(payrollDeleteErr, payrollDeleteRes) {
								// Handle Payroll error error
								if (payrollDeleteErr) done(payrollDeleteErr);

								// Set assertions
								(payrollDeleteRes.body._id).should.equal(payrollSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Payroll instance if not signed in', function(done) {
		// Set Payroll user 
		payroll.user = user;

		// Create new Payroll model instance
		var payrollObj = new Payroll(payroll);

		// Save the Payroll
		payrollObj.save(function() {
			// Try deleting Payroll
			request(app).delete('/payrolls/' + payrollObj._id)
			.expect(401)
			.end(function(payrollDeleteErr, payrollDeleteRes) {
				// Set message assertion
				(payrollDeleteRes.body.message).should.match('User is not logged in');

				// Handle Payroll error error
				done(payrollDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Payroll.remove().exec();
		done();
	});
});