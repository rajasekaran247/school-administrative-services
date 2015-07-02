'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Charge = mongoose.model('Charge'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, charge;

/**
 * Charge routes tests
 */
describe('Charge CRUD tests', function() {
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

		// Save a user to the test db and create new Charge
		user.save(function() {
			charge = {
				name: 'Charge Name'
			};

			done();
		});
	});

	it('should be able to save Charge instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Charge
				agent.post('/charges')
					.send(charge)
					.expect(200)
					.end(function(chargeSaveErr, chargeSaveRes) {
						// Handle Charge save error
						if (chargeSaveErr) done(chargeSaveErr);

						// Get a list of Charges
						agent.get('/charges')
							.end(function(chargesGetErr, chargesGetRes) {
								// Handle Charge save error
								if (chargesGetErr) done(chargesGetErr);

								// Get Charges list
								var charges = chargesGetRes.body;

								// Set assertions
								(charges[0].user._id).should.equal(userId);
								(charges[0].name).should.match('Charge Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Charge instance if not logged in', function(done) {
		agent.post('/charges')
			.send(charge)
			.expect(401)
			.end(function(chargeSaveErr, chargeSaveRes) {
				// Call the assertion callback
				done(chargeSaveErr);
			});
	});

	it('should not be able to save Charge instance if no name is provided', function(done) {
		// Invalidate name field
		charge.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Charge
				agent.post('/charges')
					.send(charge)
					.expect(400)
					.end(function(chargeSaveErr, chargeSaveRes) {
						// Set message assertion
						(chargeSaveRes.body.message).should.match('Please fill Charge name');
						
						// Handle Charge save error
						done(chargeSaveErr);
					});
			});
	});

	it('should be able to update Charge instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Charge
				agent.post('/charges')
					.send(charge)
					.expect(200)
					.end(function(chargeSaveErr, chargeSaveRes) {
						// Handle Charge save error
						if (chargeSaveErr) done(chargeSaveErr);

						// Update Charge name
						charge.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Charge
						agent.put('/charges/' + chargeSaveRes.body._id)
							.send(charge)
							.expect(200)
							.end(function(chargeUpdateErr, chargeUpdateRes) {
								// Handle Charge update error
								if (chargeUpdateErr) done(chargeUpdateErr);

								// Set assertions
								(chargeUpdateRes.body._id).should.equal(chargeSaveRes.body._id);
								(chargeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Charges if not signed in', function(done) {
		// Create new Charge model instance
		var chargeObj = new Charge(charge);

		// Save the Charge
		chargeObj.save(function() {
			// Request Charges
			request(app).get('/charges')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Charge if not signed in', function(done) {
		// Create new Charge model instance
		var chargeObj = new Charge(charge);

		// Save the Charge
		chargeObj.save(function() {
			request(app).get('/charges/' + chargeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', charge.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Charge instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Charge
				agent.post('/charges')
					.send(charge)
					.expect(200)
					.end(function(chargeSaveErr, chargeSaveRes) {
						// Handle Charge save error
						if (chargeSaveErr) done(chargeSaveErr);

						// Delete existing Charge
						agent.delete('/charges/' + chargeSaveRes.body._id)
							.send(charge)
							.expect(200)
							.end(function(chargeDeleteErr, chargeDeleteRes) {
								// Handle Charge error error
								if (chargeDeleteErr) done(chargeDeleteErr);

								// Set assertions
								(chargeDeleteRes.body._id).should.equal(chargeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Charge instance if not signed in', function(done) {
		// Set Charge user 
		charge.user = user;

		// Create new Charge model instance
		var chargeObj = new Charge(charge);

		// Save the Charge
		chargeObj.save(function() {
			// Try deleting Charge
			request(app).delete('/charges/' + chargeObj._id)
			.expect(401)
			.end(function(chargeDeleteErr, chargeDeleteRes) {
				// Set message assertion
				(chargeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Charge error error
				done(chargeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Charge.remove().exec();
		done();
	});
});