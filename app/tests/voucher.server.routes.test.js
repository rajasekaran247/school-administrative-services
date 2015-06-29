'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Voucher = mongoose.model('Voucher'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, voucher;

/**
 * Voucher routes tests
 */
describe('Voucher CRUD tests', function() {
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

		// Save a user to the test db and create new Voucher
		user.save(function() {
			voucher = {
				name: 'Voucher Name'
			};

			done();
		});
	});

	it('should be able to save Voucher instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Voucher
				agent.post('/vouchers')
					.send(voucher)
					.expect(200)
					.end(function(voucherSaveErr, voucherSaveRes) {
						// Handle Voucher save error
						if (voucherSaveErr) done(voucherSaveErr);

						// Get a list of Vouchers
						agent.get('/vouchers')
							.end(function(vouchersGetErr, vouchersGetRes) {
								// Handle Voucher save error
								if (vouchersGetErr) done(vouchersGetErr);

								// Get Vouchers list
								var vouchers = vouchersGetRes.body;

								// Set assertions
								(vouchers[0].user._id).should.equal(userId);
								(vouchers[0].name).should.match('Voucher Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Voucher instance if not logged in', function(done) {
		agent.post('/vouchers')
			.send(voucher)
			.expect(401)
			.end(function(voucherSaveErr, voucherSaveRes) {
				// Call the assertion callback
				done(voucherSaveErr);
			});
	});

	it('should not be able to save Voucher instance if no name is provided', function(done) {
		// Invalidate name field
		voucher.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Voucher
				agent.post('/vouchers')
					.send(voucher)
					.expect(400)
					.end(function(voucherSaveErr, voucherSaveRes) {
						// Set message assertion
						(voucherSaveRes.body.message).should.match('Please fill Voucher name');
						
						// Handle Voucher save error
						done(voucherSaveErr);
					});
			});
	});

	it('should be able to update Voucher instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Voucher
				agent.post('/vouchers')
					.send(voucher)
					.expect(200)
					.end(function(voucherSaveErr, voucherSaveRes) {
						// Handle Voucher save error
						if (voucherSaveErr) done(voucherSaveErr);

						// Update Voucher name
						voucher.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Voucher
						agent.put('/vouchers/' + voucherSaveRes.body._id)
							.send(voucher)
							.expect(200)
							.end(function(voucherUpdateErr, voucherUpdateRes) {
								// Handle Voucher update error
								if (voucherUpdateErr) done(voucherUpdateErr);

								// Set assertions
								(voucherUpdateRes.body._id).should.equal(voucherSaveRes.body._id);
								(voucherUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Vouchers if not signed in', function(done) {
		// Create new Voucher model instance
		var voucherObj = new Voucher(voucher);

		// Save the Voucher
		voucherObj.save(function() {
			// Request Vouchers
			request(app).get('/vouchers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Voucher if not signed in', function(done) {
		// Create new Voucher model instance
		var voucherObj = new Voucher(voucher);

		// Save the Voucher
		voucherObj.save(function() {
			request(app).get('/vouchers/' + voucherObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', voucher.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Voucher instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Voucher
				agent.post('/vouchers')
					.send(voucher)
					.expect(200)
					.end(function(voucherSaveErr, voucherSaveRes) {
						// Handle Voucher save error
						if (voucherSaveErr) done(voucherSaveErr);

						// Delete existing Voucher
						agent.delete('/vouchers/' + voucherSaveRes.body._id)
							.send(voucher)
							.expect(200)
							.end(function(voucherDeleteErr, voucherDeleteRes) {
								// Handle Voucher error error
								if (voucherDeleteErr) done(voucherDeleteErr);

								// Set assertions
								(voucherDeleteRes.body._id).should.equal(voucherSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Voucher instance if not signed in', function(done) {
		// Set Voucher user 
		voucher.user = user;

		// Create new Voucher model instance
		var voucherObj = new Voucher(voucher);

		// Save the Voucher
		voucherObj.save(function() {
			// Try deleting Voucher
			request(app).delete('/vouchers/' + voucherObj._id)
			.expect(401)
			.end(function(voucherDeleteErr, voucherDeleteRes) {
				// Set message assertion
				(voucherDeleteRes.body.message).should.match('User is not logged in');

				// Handle Voucher error error
				done(voucherDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Voucher.remove().exec();
		done();
	});
});