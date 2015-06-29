'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EmployeeLoan = mongoose.model('EmployeeLoan'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, employeeLoan;

/**
 * Employee loan routes tests
 */
describe('Employee loan CRUD tests', function() {
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

		// Save a user to the test db and create new Employee loan
		user.save(function() {
			employeeLoan = {
				name: 'Employee loan Name'
			};

			done();
		});
	});

	it('should be able to save Employee loan instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee loan
				agent.post('/employee-loans')
					.send(employeeLoan)
					.expect(200)
					.end(function(employeeLoanSaveErr, employeeLoanSaveRes) {
						// Handle Employee loan save error
						if (employeeLoanSaveErr) done(employeeLoanSaveErr);

						// Get a list of Employee loans
						agent.get('/employee-loans')
							.end(function(employeeLoansGetErr, employeeLoansGetRes) {
								// Handle Employee loan save error
								if (employeeLoansGetErr) done(employeeLoansGetErr);

								// Get Employee loans list
								var employeeLoans = employeeLoansGetRes.body;

								// Set assertions
								(employeeLoans[0].user._id).should.equal(userId);
								(employeeLoans[0].name).should.match('Employee loan Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Employee loan instance if not logged in', function(done) {
		agent.post('/employee-loans')
			.send(employeeLoan)
			.expect(401)
			.end(function(employeeLoanSaveErr, employeeLoanSaveRes) {
				// Call the assertion callback
				done(employeeLoanSaveErr);
			});
	});

	it('should not be able to save Employee loan instance if no name is provided', function(done) {
		// Invalidate name field
		employeeLoan.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee loan
				agent.post('/employee-loans')
					.send(employeeLoan)
					.expect(400)
					.end(function(employeeLoanSaveErr, employeeLoanSaveRes) {
						// Set message assertion
						(employeeLoanSaveRes.body.message).should.match('Please fill Employee loan name');
						
						// Handle Employee loan save error
						done(employeeLoanSaveErr);
					});
			});
	});

	it('should be able to update Employee loan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee loan
				agent.post('/employee-loans')
					.send(employeeLoan)
					.expect(200)
					.end(function(employeeLoanSaveErr, employeeLoanSaveRes) {
						// Handle Employee loan save error
						if (employeeLoanSaveErr) done(employeeLoanSaveErr);

						// Update Employee loan name
						employeeLoan.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Employee loan
						agent.put('/employee-loans/' + employeeLoanSaveRes.body._id)
							.send(employeeLoan)
							.expect(200)
							.end(function(employeeLoanUpdateErr, employeeLoanUpdateRes) {
								// Handle Employee loan update error
								if (employeeLoanUpdateErr) done(employeeLoanUpdateErr);

								// Set assertions
								(employeeLoanUpdateRes.body._id).should.equal(employeeLoanSaveRes.body._id);
								(employeeLoanUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Employee loans if not signed in', function(done) {
		// Create new Employee loan model instance
		var employeeLoanObj = new EmployeeLoan(employeeLoan);

		// Save the Employee loan
		employeeLoanObj.save(function() {
			// Request Employee loans
			request(app).get('/employee-loans')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Employee loan if not signed in', function(done) {
		// Create new Employee loan model instance
		var employeeLoanObj = new EmployeeLoan(employeeLoan);

		// Save the Employee loan
		employeeLoanObj.save(function() {
			request(app).get('/employee-loans/' + employeeLoanObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', employeeLoan.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Employee loan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee loan
				agent.post('/employee-loans')
					.send(employeeLoan)
					.expect(200)
					.end(function(employeeLoanSaveErr, employeeLoanSaveRes) {
						// Handle Employee loan save error
						if (employeeLoanSaveErr) done(employeeLoanSaveErr);

						// Delete existing Employee loan
						agent.delete('/employee-loans/' + employeeLoanSaveRes.body._id)
							.send(employeeLoan)
							.expect(200)
							.end(function(employeeLoanDeleteErr, employeeLoanDeleteRes) {
								// Handle Employee loan error error
								if (employeeLoanDeleteErr) done(employeeLoanDeleteErr);

								// Set assertions
								(employeeLoanDeleteRes.body._id).should.equal(employeeLoanSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Employee loan instance if not signed in', function(done) {
		// Set Employee loan user 
		employeeLoan.user = user;

		// Create new Employee loan model instance
		var employeeLoanObj = new EmployeeLoan(employeeLoan);

		// Save the Employee loan
		employeeLoanObj.save(function() {
			// Try deleting Employee loan
			request(app).delete('/employee-loans/' + employeeLoanObj._id)
			.expect(401)
			.end(function(employeeLoanDeleteErr, employeeLoanDeleteRes) {
				// Set message assertion
				(employeeLoanDeleteRes.body.message).should.match('User is not logged in');

				// Handle Employee loan error error
				done(employeeLoanDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		EmployeeLoan.remove().exec();
		done();
	});
});