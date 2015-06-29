'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Fee = mongoose.model('Fee'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, fee;

/**
 * Fee routes tests
 */
describe('Fee CRUD tests', function() {
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

		// Save a user to the test db and create new Fee
		user.save(function() {
			fee = {
				name: 'Fee Name'
			};

			done();
		});
	});

	it('should be able to save Fee instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fee
				agent.post('/fees')
					.send(fee)
					.expect(200)
					.end(function(feeSaveErr, feeSaveRes) {
						// Handle Fee save error
						if (feeSaveErr) done(feeSaveErr);

						// Get a list of Fees
						agent.get('/fees')
							.end(function(feesGetErr, feesGetRes) {
								// Handle Fee save error
								if (feesGetErr) done(feesGetErr);

								// Get Fees list
								var fees = feesGetRes.body;

								// Set assertions
								(fees[0].user._id).should.equal(userId);
								(fees[0].name).should.match('Fee Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Fee instance if not logged in', function(done) {
		agent.post('/fees')
			.send(fee)
			.expect(401)
			.end(function(feeSaveErr, feeSaveRes) {
				// Call the assertion callback
				done(feeSaveErr);
			});
	});

	it('should not be able to save Fee instance if no name is provided', function(done) {
		// Invalidate name field
		fee.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fee
				agent.post('/fees')
					.send(fee)
					.expect(400)
					.end(function(feeSaveErr, feeSaveRes) {
						// Set message assertion
						(feeSaveRes.body.message).should.match('Please fill Fee name');
						
						// Handle Fee save error
						done(feeSaveErr);
					});
			});
	});

	it('should be able to update Fee instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fee
				agent.post('/fees')
					.send(fee)
					.expect(200)
					.end(function(feeSaveErr, feeSaveRes) {
						// Handle Fee save error
						if (feeSaveErr) done(feeSaveErr);

						// Update Fee name
						fee.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Fee
						agent.put('/fees/' + feeSaveRes.body._id)
							.send(fee)
							.expect(200)
							.end(function(feeUpdateErr, feeUpdateRes) {
								// Handle Fee update error
								if (feeUpdateErr) done(feeUpdateErr);

								// Set assertions
								(feeUpdateRes.body._id).should.equal(feeSaveRes.body._id);
								(feeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Fees if not signed in', function(done) {
		// Create new Fee model instance
		var feeObj = new Fee(fee);

		// Save the Fee
		feeObj.save(function() {
			// Request Fees
			request(app).get('/fees')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Fee if not signed in', function(done) {
		// Create new Fee model instance
		var feeObj = new Fee(fee);

		// Save the Fee
		feeObj.save(function() {
			request(app).get('/fees/' + feeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', fee.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Fee instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fee
				agent.post('/fees')
					.send(fee)
					.expect(200)
					.end(function(feeSaveErr, feeSaveRes) {
						// Handle Fee save error
						if (feeSaveErr) done(feeSaveErr);

						// Delete existing Fee
						agent.delete('/fees/' + feeSaveRes.body._id)
							.send(fee)
							.expect(200)
							.end(function(feeDeleteErr, feeDeleteRes) {
								// Handle Fee error error
								if (feeDeleteErr) done(feeDeleteErr);

								// Set assertions
								(feeDeleteRes.body._id).should.equal(feeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Fee instance if not signed in', function(done) {
		// Set Fee user 
		fee.user = user;

		// Create new Fee model instance
		var feeObj = new Fee(fee);

		// Save the Fee
		feeObj.save(function() {
			// Try deleting Fee
			request(app).delete('/fees/' + feeObj._id)
			.expect(401)
			.end(function(feeDeleteErr, feeDeleteRes) {
				// Set message assertion
				(feeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Fee error error
				done(feeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Fee.remove().exec();
		done();
	});
});