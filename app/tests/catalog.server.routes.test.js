'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Catalog = mongoose.model('Catalog'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, catalog;

/**
 * Catalog routes tests
 */
describe('Catalog CRUD tests', function() {
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

		// Save a user to the test db and create new Catalog
		user.save(function() {
			catalog = {
				name: 'Catalog Name'
			};

			done();
		});
	});

	it('should be able to save Catalog instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Catalog
				agent.post('/catalogs')
					.send(catalog)
					.expect(200)
					.end(function(catalogSaveErr, catalogSaveRes) {
						// Handle Catalog save error
						if (catalogSaveErr) done(catalogSaveErr);

						// Get a list of Catalogs
						agent.get('/catalogs')
							.end(function(catalogsGetErr, catalogsGetRes) {
								// Handle Catalog save error
								if (catalogsGetErr) done(catalogsGetErr);

								// Get Catalogs list
								var catalogs = catalogsGetRes.body;

								// Set assertions
								(catalogs[0].user._id).should.equal(userId);
								(catalogs[0].name).should.match('Catalog Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Catalog instance if not logged in', function(done) {
		agent.post('/catalogs')
			.send(catalog)
			.expect(401)
			.end(function(catalogSaveErr, catalogSaveRes) {
				// Call the assertion callback
				done(catalogSaveErr);
			});
	});

	it('should not be able to save Catalog instance if no name is provided', function(done) {
		// Invalidate name field
		catalog.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Catalog
				agent.post('/catalogs')
					.send(catalog)
					.expect(400)
					.end(function(catalogSaveErr, catalogSaveRes) {
						// Set message assertion
						(catalogSaveRes.body.message).should.match('Please fill Catalog name');
						
						// Handle Catalog save error
						done(catalogSaveErr);
					});
			});
	});

	it('should be able to update Catalog instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Catalog
				agent.post('/catalogs')
					.send(catalog)
					.expect(200)
					.end(function(catalogSaveErr, catalogSaveRes) {
						// Handle Catalog save error
						if (catalogSaveErr) done(catalogSaveErr);

						// Update Catalog name
						catalog.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Catalog
						agent.put('/catalogs/' + catalogSaveRes.body._id)
							.send(catalog)
							.expect(200)
							.end(function(catalogUpdateErr, catalogUpdateRes) {
								// Handle Catalog update error
								if (catalogUpdateErr) done(catalogUpdateErr);

								// Set assertions
								(catalogUpdateRes.body._id).should.equal(catalogSaveRes.body._id);
								(catalogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Catalogs if not signed in', function(done) {
		// Create new Catalog model instance
		var catalogObj = new Catalog(catalog);

		// Save the Catalog
		catalogObj.save(function() {
			// Request Catalogs
			request(app).get('/catalogs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Catalog if not signed in', function(done) {
		// Create new Catalog model instance
		var catalogObj = new Catalog(catalog);

		// Save the Catalog
		catalogObj.save(function() {
			request(app).get('/catalogs/' + catalogObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', catalog.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Catalog instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Catalog
				agent.post('/catalogs')
					.send(catalog)
					.expect(200)
					.end(function(catalogSaveErr, catalogSaveRes) {
						// Handle Catalog save error
						if (catalogSaveErr) done(catalogSaveErr);

						// Delete existing Catalog
						agent.delete('/catalogs/' + catalogSaveRes.body._id)
							.send(catalog)
							.expect(200)
							.end(function(catalogDeleteErr, catalogDeleteRes) {
								// Handle Catalog error error
								if (catalogDeleteErr) done(catalogDeleteErr);

								// Set assertions
								(catalogDeleteRes.body._id).should.equal(catalogSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Catalog instance if not signed in', function(done) {
		// Set Catalog user 
		catalog.user = user;

		// Create new Catalog model instance
		var catalogObj = new Catalog(catalog);

		// Save the Catalog
		catalogObj.save(function() {
			// Try deleting Catalog
			request(app).delete('/catalogs/' + catalogObj._id)
			.expect(401)
			.end(function(catalogDeleteErr, catalogDeleteRes) {
				// Set message assertion
				(catalogDeleteRes.body.message).should.match('User is not logged in');

				// Handle Catalog error error
				done(catalogDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Catalog.remove().exec();
		done();
	});
});