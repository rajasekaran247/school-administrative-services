'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EmployeePayroll = mongoose.model('EmployeePayroll'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, employeePayroll;

/**
 * Employee payroll routes tests
 */
describe('Employee payroll CRUD tests', function() {
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

		// Save a user to the test db and create new Employee payroll
		user.save(function() {
			employeePayroll = {
				name: 'Employee payroll Name'
			};

			done();
		});
	});

	it('should be able to save Employee payroll instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee payroll
				agent.post('/employee-payrolls')
					.send(employeePayroll)
					.expect(200)
					.end(function(employeePayrollSaveErr, employeePayrollSaveRes) {
						// Handle Employee payroll save error
						if (employeePayrollSaveErr) done(employeePayrollSaveErr);

						// Get a list of Employee payrolls
						agent.get('/employee-payrolls')
							.end(function(employeePayrollsGetErr, employeePayrollsGetRes) {
								// Handle Employee payroll save error
								if (employeePayrollsGetErr) done(employeePayrollsGetErr);

								// Get Employee payrolls list
								var employeePayrolls = employeePayrollsGetRes.body;

								// Set assertions
								(employeePayrolls[0].user._id).should.equal(userId);
								(employeePayrolls[0].name).should.match('Employee payroll Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Employee payroll instance if not logged in', function(done) {
		agent.post('/employee-payrolls')
			.send(employeePayroll)
			.expect(401)
			.end(function(employeePayrollSaveErr, employeePayrollSaveRes) {
				// Call the assertion callback
				done(employeePayrollSaveErr);
			});
	});

	it('should not be able to save Employee payroll instance if no name is provided', function(done) {
		// Invalidate name field
		employeePayroll.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee payroll
				agent.post('/employee-payrolls')
					.send(employeePayroll)
					.expect(400)
					.end(function(employeePayrollSaveErr, employeePayrollSaveRes) {
						// Set message assertion
						(employeePayrollSaveRes.body.message).should.match('Please fill Employee payroll name');
						
						// Handle Employee payroll save error
						done(employeePayrollSaveErr);
					});
			});
	});

	it('should be able to update Employee payroll instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee payroll
				agent.post('/employee-payrolls')
					.send(employeePayroll)
					.expect(200)
					.end(function(employeePayrollSaveErr, employeePayrollSaveRes) {
						// Handle Employee payroll save error
						if (employeePayrollSaveErr) done(employeePayrollSaveErr);

						// Update Employee payroll name
						employeePayroll.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Employee payroll
						agent.put('/employee-payrolls/' + employeePayrollSaveRes.body._id)
							.send(employeePayroll)
							.expect(200)
							.end(function(employeePayrollUpdateErr, employeePayrollUpdateRes) {
								// Handle Employee payroll update error
								if (employeePayrollUpdateErr) done(employeePayrollUpdateErr);

								// Set assertions
								(employeePayrollUpdateRes.body._id).should.equal(employeePayrollSaveRes.body._id);
								(employeePayrollUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Employee payrolls if not signed in', function(done) {
		// Create new Employee payroll model instance
		var employeePayrollObj = new EmployeePayroll(employeePayroll);

		// Save the Employee payroll
		employeePayrollObj.save(function() {
			// Request Employee payrolls
			request(app).get('/employee-payrolls')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Employee payroll if not signed in', function(done) {
		// Create new Employee payroll model instance
		var employeePayrollObj = new EmployeePayroll(employeePayroll);

		// Save the Employee payroll
		employeePayrollObj.save(function() {
			request(app).get('/employee-payrolls/' + employeePayrollObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', employeePayroll.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Employee payroll instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Employee payroll
				agent.post('/employee-payrolls')
					.send(employeePayroll)
					.expect(200)
					.end(function(employeePayrollSaveErr, employeePayrollSaveRes) {
						// Handle Employee payroll save error
						if (employeePayrollSaveErr) done(employeePayrollSaveErr);

						// Delete existing Employee payroll
						agent.delete('/employee-payrolls/' + employeePayrollSaveRes.body._id)
							.send(employeePayroll)
							.expect(200)
							.end(function(employeePayrollDeleteErr, employeePayrollDeleteRes) {
								// Handle Employee payroll error error
								if (employeePayrollDeleteErr) done(employeePayrollDeleteErr);

								// Set assertions
								(employeePayrollDeleteRes.body._id).should.equal(employeePayrollSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Employee payroll instance if not signed in', function(done) {
		// Set Employee payroll user 
		employeePayroll.user = user;

		// Create new Employee payroll model instance
		var employeePayrollObj = new EmployeePayroll(employeePayroll);

		// Save the Employee payroll
		employeePayrollObj.save(function() {
			// Try deleting Employee payroll
			request(app).delete('/employee-payrolls/' + employeePayrollObj._id)
			.expect(401)
			.end(function(employeePayrollDeleteErr, employeePayrollDeleteRes) {
				// Set message assertion
				(employeePayrollDeleteRes.body.message).should.match('User is not logged in');

				// Handle Employee payroll error error
				done(employeePayrollDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		EmployeePayroll.remove().exec();
		done();
	});
});