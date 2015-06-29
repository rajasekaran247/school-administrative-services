'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	TransportCharge = mongoose.model('TransportCharge'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, transportCharge;

/**
 * Transport charge routes tests
 */
describe('Transport charge CRUD tests', function() {
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

		// Save a user to the test db and create new Transport charge
		user.save(function() {
			transportCharge = {
				name: 'Transport charge Name'
			};

			done();
		});
	});

	it('should be able to save Transport charge instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transport charge
				agent.post('/transport-charges')
					.send(transportCharge)
					.expect(200)
					.end(function(transportChargeSaveErr, transportChargeSaveRes) {
						// Handle Transport charge save error
						if (transportChargeSaveErr) done(transportChargeSaveErr);

						// Get a list of Transport charges
						agent.get('/transport-charges')
							.end(function(transportChargesGetErr, transportChargesGetRes) {
								// Handle Transport charge save error
								if (transportChargesGetErr) done(transportChargesGetErr);

								// Get Transport charges list
								var transportCharges = transportChargesGetRes.body;

								// Set assertions
								(transportCharges[0].user._id).should.equal(userId);
								(transportCharges[0].name).should.match('Transport charge Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Transport charge instance if not logged in', function(done) {
		agent.post('/transport-charges')
			.send(transportCharge)
			.expect(401)
			.end(function(transportChargeSaveErr, transportChargeSaveRes) {
				// Call the assertion callback
				done(transportChargeSaveErr);
			});
	});

	it('should not be able to save Transport charge instance if no name is provided', function(done) {
		// Invalidate name field
		transportCharge.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transport charge
				agent.post('/transport-charges')
					.send(transportCharge)
					.expect(400)
					.end(function(transportChargeSaveErr, transportChargeSaveRes) {
						// Set message assertion
						(transportChargeSaveRes.body.message).should.match('Please fill Transport charge name');
						
						// Handle Transport charge save error
						done(transportChargeSaveErr);
					});
			});
	});

	it('should be able to update Transport charge instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transport charge
				agent.post('/transport-charges')
					.send(transportCharge)
					.expect(200)
					.end(function(transportChargeSaveErr, transportChargeSaveRes) {
						// Handle Transport charge save error
						if (transportChargeSaveErr) done(transportChargeSaveErr);

						// Update Transport charge name
						transportCharge.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Transport charge
						agent.put('/transport-charges/' + transportChargeSaveRes.body._id)
							.send(transportCharge)
							.expect(200)
							.end(function(transportChargeUpdateErr, transportChargeUpdateRes) {
								// Handle Transport charge update error
								if (transportChargeUpdateErr) done(transportChargeUpdateErr);

								// Set assertions
								(transportChargeUpdateRes.body._id).should.equal(transportChargeSaveRes.body._id);
								(transportChargeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Transport charges if not signed in', function(done) {
		// Create new Transport charge model instance
		var transportChargeObj = new TransportCharge(transportCharge);

		// Save the Transport charge
		transportChargeObj.save(function() {
			// Request Transport charges
			request(app).get('/transport-charges')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Transport charge if not signed in', function(done) {
		// Create new Transport charge model instance
		var transportChargeObj = new TransportCharge(transportCharge);

		// Save the Transport charge
		transportChargeObj.save(function() {
			request(app).get('/transport-charges/' + transportChargeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', transportCharge.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Transport charge instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Transport charge
				agent.post('/transport-charges')
					.send(transportCharge)
					.expect(200)
					.end(function(transportChargeSaveErr, transportChargeSaveRes) {
						// Handle Transport charge save error
						if (transportChargeSaveErr) done(transportChargeSaveErr);

						// Delete existing Transport charge
						agent.delete('/transport-charges/' + transportChargeSaveRes.body._id)
							.send(transportCharge)
							.expect(200)
							.end(function(transportChargeDeleteErr, transportChargeDeleteRes) {
								// Handle Transport charge error error
								if (transportChargeDeleteErr) done(transportChargeDeleteErr);

								// Set assertions
								(transportChargeDeleteRes.body._id).should.equal(transportChargeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Transport charge instance if not signed in', function(done) {
		// Set Transport charge user 
		transportCharge.user = user;

		// Create new Transport charge model instance
		var transportChargeObj = new TransportCharge(transportCharge);

		// Save the Transport charge
		transportChargeObj.save(function() {
			// Try deleting Transport charge
			request(app).delete('/transport-charges/' + transportChargeObj._id)
			.expect(401)
			.end(function(transportChargeDeleteErr, transportChargeDeleteRes) {
				// Set message assertion
				(transportChargeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Transport charge error error
				done(transportChargeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		TransportCharge.remove().exec();
		done();
	});
});