'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EmployeeLeave = mongoose.model('EmployeeLeave'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, employeeLeave;

/**
 * Employee leave routes tests
 */
describe('Employee leave CRUD tests', function() {
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

		// Save a user to the test db and create new Employee leave
		user.save(function() {
			employeeLeave = {
				name: 'Employee leave Name'
			};

			done();
		});
	});

	it('should be able to save Employee leave instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee leave
				agent.post('/employee-leaves')
					.send(employeeLeave)
					.expect(200)
					.end(function(employeeLeaveSaveErr, employeeLeaveSaveRes) {
						// Handle Employee leave save error
						if (employeeLeaveSaveErr) done(employeeLeaveSaveErr);

						// Get a list of Employee leaves
						agent.get('/employee-leaves')
							.end(function(employeeLeavesGetErr, employeeLeavesGetRes) {
								// Handle Employee leave save error
								if (employeeLeavesGetErr) done(employeeLeavesGetErr);

								// Get Employee leaves list
								var employeeLeaves = employeeLeavesGetRes.body;

								// Set assertions
								(employeeLeaves[0].user._id).should.equal(userId);
								(employeeLeaves[0].name).should.match('Employee leave Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Employee leave instance if not logged in', function(done) {
		agent.post('/employee-leaves')
			.send(employeeLeave)
			.expect(401)
			.end(function(employeeLeaveSaveErr, employeeLeaveSaveRes) {
				// Call the assertion callback
				done(employeeLeaveSaveErr);
			});
	});

	it('should not be able to save Employee leave instance if no name is provided', function(done) {
		// Invalidate name field
		employeeLeave.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee leave
				agent.post('/employee-leaves')
					.send(employeeLeave)
					.expect(400)
					.end(function(employeeLeaveSaveErr, employeeLeaveSaveRes) {
						// Set message assertion
						(employeeLeaveSaveRes.body.message).should.match('Please fill Employee leave name');
						
						// Handle Employee leave save error
						done(employeeLeaveSaveErr);
					});
			});
	});

	it('should be able to update Employee leave instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee leave
				agent.post('/employee-leaves')
					.send(employeeLeave)
					.expect(200)
					.end(function(employeeLeaveSaveErr, employeeLeaveSaveRes) {
						// Handle Employee leave save error
						if (employeeLeaveSaveErr) done(employeeLeaveSaveErr);

						// Update Employee leave name
						employeeLeave.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Employee leave
						agent.put('/employee-leaves/' + employeeLeaveSaveRes.body._id)
							.send(employeeLeave)
							.expect(200)
							.end(function(employeeLeaveUpdateErr, employeeLeaveUpdateRes) {
								// Handle Employee leave update error
								if (employeeLeaveUpdateErr) done(employeeLeaveUpdateErr);

								// Set assertions
								(employeeLeaveUpdateRes.body._id).should.equal(employeeLeaveSaveRes.body._id);
								(employeeLeaveUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Employee leaves if not signed in', function(done) {
		// Create new Employee leave model instance
		var employeeLeaveObj = new EmployeeLeave(employeeLeave);

		// Save the Employee leave
		employeeLeaveObj.save(function() {
			// Request Employee leaves
			request(app).get('/employee-leaves')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Employee leave if not signed in', function(done) {
		// Create new Employee leave model instance
		var employeeLeaveObj = new EmployeeLeave(employeeLeave);

		// Save the Employee leave
		employeeLeaveObj.save(function() {
			request(app).get('/employee-leaves/' + employeeLeaveObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', employeeLeave.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Employee leave instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee leave
				agent.post('/employee-leaves')
					.send(employeeLeave)
					.expect(200)
					.end(function(employeeLeaveSaveErr, employeeLeaveSaveRes) {
						// Handle Employee leave save error
						if (employeeLeaveSaveErr) done(employeeLeaveSaveErr);

						// Delete existing Employee leave
						agent.delete('/employee-leaves/' + employeeLeaveSaveRes.body._id)
							.send(employeeLeave)
							.expect(200)
							.end(function(employeeLeaveDeleteErr, employeeLeaveDeleteRes) {
								// Handle Employee leave error error
								if (employeeLeaveDeleteErr) done(employeeLeaveDeleteErr);

								// Set assertions
								(employeeLeaveDeleteRes.body._id).should.equal(employeeLeaveSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Employee leave instance if not signed in', function(done) {
		// Set Employee leave user 
		employeeLeave.user = user;

		// Create new Employee leave model instance
		var employeeLeaveObj = new EmployeeLeave(employeeLeave);

		// Save the Employee leave
		employeeLeaveObj.save(function() {
			// Try deleting Employee leave
			request(app).delete('/employee-leaves/' + employeeLeaveObj._id)
			.expect(401)
			.end(function(employeeLeaveDeleteErr, employeeLeaveDeleteRes) {
				// Set message assertion
				(employeeLeaveDeleteRes.body.message).should.match('User is not logged in');

				// Handle Employee leave error error
				done(employeeLeaveDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		EmployeeLeave.remove().exec();
		done();
	});
});