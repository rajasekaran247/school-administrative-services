'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Grade = mongoose.model('Grade'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, grade;

/**
 * Grade routes tests
 */
describe('Grade CRUD tests', function() {
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

		// Save a user to the test db and create new Grade
		user.save(function() {
			grade = {
				name: 'Grade Name'
			};

			done();
		});
	});

	it('should be able to save Grade instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grade
				agent.post('/grades')
					.send(grade)
					.expect(200)
					.end(function(gradeSaveErr, gradeSaveRes) {
						// Handle Grade save error
						if (gradeSaveErr) done(gradeSaveErr);

						// Get a list of Grades
						agent.get('/grades')
							.end(function(gradesGetErr, gradesGetRes) {
								// Handle Grade save error
								if (gradesGetErr) done(gradesGetErr);

								// Get Grades list
								var grades = gradesGetRes.body;

								// Set assertions
								(grades[0].user._id).should.equal(userId);
								(grades[0].name).should.match('Grade Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Grade instance if not logged in', function(done) {
		agent.post('/grades')
			.send(grade)
			.expect(401)
			.end(function(gradeSaveErr, gradeSaveRes) {
				// Call the assertion callback
				done(gradeSaveErr);
			});
	});

	it('should not be able to save Grade instance if no name is provided', function(done) {
		// Invalidate name field
		grade.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grade
				agent.post('/grades')
					.send(grade)
					.expect(400)
					.end(function(gradeSaveErr, gradeSaveRes) {
						// Set message assertion
						(gradeSaveRes.body.message).should.match('Please fill Grade name');
						
						// Handle Grade save error
						done(gradeSaveErr);
					});
			});
	});

	it('should be able to update Grade instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grade
				agent.post('/grades')
					.send(grade)
					.expect(200)
					.end(function(gradeSaveErr, gradeSaveRes) {
						// Handle Grade save error
						if (gradeSaveErr) done(gradeSaveErr);

						// Update Grade name
						grade.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Grade
						agent.put('/grades/' + gradeSaveRes.body._id)
							.send(grade)
							.expect(200)
							.end(function(gradeUpdateErr, gradeUpdateRes) {
								// Handle Grade update error
								if (gradeUpdateErr) done(gradeUpdateErr);

								// Set assertions
								(gradeUpdateRes.body._id).should.equal(gradeSaveRes.body._id);
								(gradeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Grades if not signed in', function(done) {
		// Create new Grade model instance
		var gradeObj = new Grade(grade);

		// Save the Grade
		gradeObj.save(function() {
			// Request Grades
			request(app).get('/grades')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Grade if not signed in', function(done) {
		// Create new Grade model instance
		var gradeObj = new Grade(grade);

		// Save the Grade
		gradeObj.save(function() {
			request(app).get('/grades/' + gradeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', grade.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Grade instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grade
				agent.post('/grades')
					.send(grade)
					.expect(200)
					.end(function(gradeSaveErr, gradeSaveRes) {
						// Handle Grade save error
						if (gradeSaveErr) done(gradeSaveErr);

						// Delete existing Grade
						agent.delete('/grades/' + gradeSaveRes.body._id)
							.send(grade)
							.expect(200)
							.end(function(gradeDeleteErr, gradeDeleteRes) {
								// Handle Grade error error
								if (gradeDeleteErr) done(gradeDeleteErr);

								// Set assertions
								(gradeDeleteRes.body._id).should.equal(gradeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Grade instance if not signed in', function(done) {
		// Set Grade user 
		grade.user = user;

		// Create new Grade model instance
		var gradeObj = new Grade(grade);

		// Save the Grade
		gradeObj.save(function() {
			// Try deleting Grade
			request(app).delete('/grades/' + gradeObj._id)
			.expect(401)
			.end(function(gradeDeleteErr, gradeDeleteRes) {
				// Set message assertion
				(gradeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Grade error error
				done(gradeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Grade.remove().exec();
		done();
	});
});