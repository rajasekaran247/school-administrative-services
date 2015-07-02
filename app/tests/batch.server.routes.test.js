'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Batch = mongoose.model('Batch'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, batch;

/**
 * Batch routes tests
 */
describe('Batch CRUD tests', function() {
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

		// Save a user to the test db and create new Batch
		user.save(function() {
			batch = {
				name: 'Batch Name'
			};

			done();
		});
	});

	it('should be able to save Batch instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Batch
				agent.post('/batches')
					.send(batch)
					.expect(200)
					.end(function(batchSaveErr, batchSaveRes) {
						// Handle Batch save error
						if (batchSaveErr) done(batchSaveErr);

						// Get a list of Batches
						agent.get('/batches')
							.end(function(batchesGetErr, batchesGetRes) {
								// Handle Batch save error
								if (batchesGetErr) done(batchesGetErr);

								// Get Batches list
								var batches = batchesGetRes.body;

								// Set assertions
								(batches[0].user._id).should.equal(userId);
								(batches[0].name).should.match('Batch Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Batch instance if not logged in', function(done) {
		agent.post('/batches')
			.send(batch)
			.expect(401)
			.end(function(batchSaveErr, batchSaveRes) {
				// Call the assertion callback
				done(batchSaveErr);
			});
	});

	it('should not be able to save Batch instance if no name is provided', function(done) {
		// Invalidate name field
		batch.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Batch
				agent.post('/batches')
					.send(batch)
					.expect(400)
					.end(function(batchSaveErr, batchSaveRes) {
						// Set message assertion
						(batchSaveRes.body.message).should.match('Please fill Batch name');
						
						// Handle Batch save error
						done(batchSaveErr);
					});
			});
	});

	it('should be able to update Batch instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Batch
				agent.post('/batches')
					.send(batch)
					.expect(200)
					.end(function(batchSaveErr, batchSaveRes) {
						// Handle Batch save error
						if (batchSaveErr) done(batchSaveErr);

						// Update Batch name
						batch.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Batch
						agent.put('/batches/' + batchSaveRes.body._id)
							.send(batch)
							.expect(200)
							.end(function(batchUpdateErr, batchUpdateRes) {
								// Handle Batch update error
								if (batchUpdateErr) done(batchUpdateErr);

								// Set assertions
								(batchUpdateRes.body._id).should.equal(batchSaveRes.body._id);
								(batchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Batches if not signed in', function(done) {
		// Create new Batch model instance
		var batchObj = new Batch(batch);

		// Save the Batch
		batchObj.save(function() {
			// Request Batches
			request(app).get('/batches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Batch if not signed in', function(done) {
		// Create new Batch model instance
		var batchObj = new Batch(batch);

		// Save the Batch
		batchObj.save(function() {
			request(app).get('/batches/' + batchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', batch.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Batch instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Batch
				agent.post('/batches')
					.send(batch)
					.expect(200)
					.end(function(batchSaveErr, batchSaveRes) {
						// Handle Batch save error
						if (batchSaveErr) done(batchSaveErr);

						// Delete existing Batch
						agent.delete('/batches/' + batchSaveRes.body._id)
							.send(batch)
							.expect(200)
							.end(function(batchDeleteErr, batchDeleteRes) {
								// Handle Batch error error
								if (batchDeleteErr) done(batchDeleteErr);

								// Set assertions
								(batchDeleteRes.body._id).should.equal(batchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Batch instance if not signed in', function(done) {
		// Set Batch user 
		batch.user = user;

		// Create new Batch model instance
		var batchObj = new Batch(batch);

		// Save the Batch
		batchObj.save(function() {
			// Try deleting Batch
			request(app).delete('/batches/' + batchObj._id)
			.expect(401)
			.end(function(batchDeleteErr, batchDeleteRes) {
				// Set message assertion
				(batchDeleteRes.body.message).should.match('User is not logged in');

				// Handle Batch error error
				done(batchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Batch.remove().exec();
		done();
	});
});