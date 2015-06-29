'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Library = mongoose.model('Library'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, library;

/**
 * Library routes tests
 */
describe('Library CRUD tests', function() {
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

		// Save a user to the test db and create new Library
		user.save(function() {
			library = {
				name: 'Library Name'
			};

			done();
		});
	});

	it('should be able to save Library instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Library
				agent.post('/libraries')
					.send(library)
					.expect(200)
					.end(function(librarySaveErr, librarySaveRes) {
						// Handle Library save error
						if (librarySaveErr) done(librarySaveErr);

						// Get a list of Libraries
						agent.get('/libraries')
							.end(function(librariesGetErr, librariesGetRes) {
								// Handle Library save error
								if (librariesGetErr) done(librariesGetErr);

								// Get Libraries list
								var libraries = librariesGetRes.body;

								// Set assertions
								(libraries[0].user._id).should.equal(userId);
								(libraries[0].name).should.match('Library Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Library instance if not logged in', function(done) {
		agent.post('/libraries')
			.send(library)
			.expect(401)
			.end(function(librarySaveErr, librarySaveRes) {
				// Call the assertion callback
				done(librarySaveErr);
			});
	});

	it('should not be able to save Library instance if no name is provided', function(done) {
		// Invalidate name field
		library.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Library
				agent.post('/libraries')
					.send(library)
					.expect(400)
					.end(function(librarySaveErr, librarySaveRes) {
						// Set message assertion
						(librarySaveRes.body.message).should.match('Please fill Library name');
						
						// Handle Library save error
						done(librarySaveErr);
					});
			});
	});

	it('should be able to update Library instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Library
				agent.post('/libraries')
					.send(library)
					.expect(200)
					.end(function(librarySaveErr, librarySaveRes) {
						// Handle Library save error
						if (librarySaveErr) done(librarySaveErr);

						// Update Library name
						library.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Library
						agent.put('/libraries/' + librarySaveRes.body._id)
							.send(library)
							.expect(200)
							.end(function(libraryUpdateErr, libraryUpdateRes) {
								// Handle Library update error
								if (libraryUpdateErr) done(libraryUpdateErr);

								// Set assertions
								(libraryUpdateRes.body._id).should.equal(librarySaveRes.body._id);
								(libraryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Libraries if not signed in', function(done) {
		// Create new Library model instance
		var libraryObj = new Library(library);

		// Save the Library
		libraryObj.save(function() {
			// Request Libraries
			request(app).get('/libraries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Library if not signed in', function(done) {
		// Create new Library model instance
		var libraryObj = new Library(library);

		// Save the Library
		libraryObj.save(function() {
			request(app).get('/libraries/' + libraryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', library.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Library instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Library
				agent.post('/libraries')
					.send(library)
					.expect(200)
					.end(function(librarySaveErr, librarySaveRes) {
						// Handle Library save error
						if (librarySaveErr) done(librarySaveErr);

						// Delete existing Library
						agent.delete('/libraries/' + librarySaveRes.body._id)
							.send(library)
							.expect(200)
							.end(function(libraryDeleteErr, libraryDeleteRes) {
								// Handle Library error error
								if (libraryDeleteErr) done(libraryDeleteErr);

								// Set assertions
								(libraryDeleteRes.body._id).should.equal(librarySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Library instance if not signed in', function(done) {
		// Set Library user 
		library.user = user;

		// Create new Library model instance
		var libraryObj = new Library(library);

		// Save the Library
		libraryObj.save(function() {
			// Try deleting Library
			request(app).delete('/libraries/' + libraryObj._id)
			.expect(401)
			.end(function(libraryDeleteErr, libraryDeleteRes) {
				// Set message assertion
				(libraryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Library error error
				done(libraryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Library.remove().exec();
		done();
	});
});