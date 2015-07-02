'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LibraryMember = mongoose.model('LibraryMember'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, libraryMember;

/**
 * Library member routes tests
 */
describe('Library member CRUD tests', function() {
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

		// Save a user to the test db and create new Library member
		user.save(function() {
			libraryMember = {
				name: 'Library member Name'
			};

			done();
		});
	});

	it('should be able to save Library member instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Library member
				agent.post('/library-members')
					.send(libraryMember)
					.expect(200)
					.end(function(libraryMemberSaveErr, libraryMemberSaveRes) {
						// Handle Library member save error
						if (libraryMemberSaveErr) done(libraryMemberSaveErr);

						// Get a list of Library members
						agent.get('/library-members')
							.end(function(libraryMembersGetErr, libraryMembersGetRes) {
								// Handle Library member save error
								if (libraryMembersGetErr) done(libraryMembersGetErr);

								// Get Library members list
								var libraryMembers = libraryMembersGetRes.body;

								// Set assertions
								(libraryMembers[0].user._id).should.equal(userId);
								(libraryMembers[0].name).should.match('Library member Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Library member instance if not logged in', function(done) {
		agent.post('/library-members')
			.send(libraryMember)
			.expect(401)
			.end(function(libraryMemberSaveErr, libraryMemberSaveRes) {
				// Call the assertion callback
				done(libraryMemberSaveErr);
			});
	});

	it('should not be able to save Library member instance if no name is provided', function(done) {
		// Invalidate name field
		libraryMember.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Library member
				agent.post('/library-members')
					.send(libraryMember)
					.expect(400)
					.end(function(libraryMemberSaveErr, libraryMemberSaveRes) {
						// Set message assertion
						(libraryMemberSaveRes.body.message).should.match('Please fill Library member name');
						
						// Handle Library member save error
						done(libraryMemberSaveErr);
					});
			});
	});

	it('should be able to update Library member instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Library member
				agent.post('/library-members')
					.send(libraryMember)
					.expect(200)
					.end(function(libraryMemberSaveErr, libraryMemberSaveRes) {
						// Handle Library member save error
						if (libraryMemberSaveErr) done(libraryMemberSaveErr);

						// Update Library member name
						libraryMember.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Library member
						agent.put('/library-members/' + libraryMemberSaveRes.body._id)
							.send(libraryMember)
							.expect(200)
							.end(function(libraryMemberUpdateErr, libraryMemberUpdateRes) {
								// Handle Library member update error
								if (libraryMemberUpdateErr) done(libraryMemberUpdateErr);

								// Set assertions
								(libraryMemberUpdateRes.body._id).should.equal(libraryMemberSaveRes.body._id);
								(libraryMemberUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Library members if not signed in', function(done) {
		// Create new Library member model instance
		var libraryMemberObj = new LibraryMember(libraryMember);

		// Save the Library member
		libraryMemberObj.save(function() {
			// Request Library members
			request(app).get('/library-members')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Library member if not signed in', function(done) {
		// Create new Library member model instance
		var libraryMemberObj = new LibraryMember(libraryMember);

		// Save the Library member
		libraryMemberObj.save(function() {
			request(app).get('/library-members/' + libraryMemberObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', libraryMember.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Library member instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Library member
				agent.post('/library-members')
					.send(libraryMember)
					.expect(200)
					.end(function(libraryMemberSaveErr, libraryMemberSaveRes) {
						// Handle Library member save error
						if (libraryMemberSaveErr) done(libraryMemberSaveErr);

						// Delete existing Library member
						agent.delete('/library-members/' + libraryMemberSaveRes.body._id)
							.send(libraryMember)
							.expect(200)
							.end(function(libraryMemberDeleteErr, libraryMemberDeleteRes) {
								// Handle Library member error error
								if (libraryMemberDeleteErr) done(libraryMemberDeleteErr);

								// Set assertions
								(libraryMemberDeleteRes.body._id).should.equal(libraryMemberSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Library member instance if not signed in', function(done) {
		// Set Library member user 
		libraryMember.user = user;

		// Create new Library member model instance
		var libraryMemberObj = new LibraryMember(libraryMember);

		// Save the Library member
		libraryMemberObj.save(function() {
			// Try deleting Library member
			request(app).delete('/library-members/' + libraryMemberObj._id)
			.expect(401)
			.end(function(libraryMemberDeleteErr, libraryMemberDeleteRes) {
				// Set message assertion
				(libraryMemberDeleteRes.body.message).should.match('User is not logged in');

				// Handle Library member error error
				done(libraryMemberDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		LibraryMember.remove().exec();
		done();
	});
});