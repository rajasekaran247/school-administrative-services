'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EmployeeLeave = mongoose.model('EmployeeLeave');

/**
 * Globals
 */
var user, employeeLeave;

/**
 * Unit tests
 */
describe('Employee leave Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			employeeLeave = new EmployeeLeave({
				name: 'Employee leave Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return employeeLeave.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			employeeLeave.name = '';

			return employeeLeave.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		EmployeeLeave.remove().exec();
		User.remove().exec();

		done();
	});
});