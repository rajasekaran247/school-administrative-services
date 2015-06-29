'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EmployeeLoan = mongoose.model('EmployeeLoan');

/**
 * Globals
 */
var user, employeeLoan;

/**
 * Unit tests
 */
describe('Employee loan Model Unit Tests:', function() {
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
			employeeLoan = new EmployeeLoan({
				name: 'Employee loan Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return employeeLoan.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			employeeLoan.name = '';

			return employeeLoan.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		EmployeeLoan.remove().exec();
		User.remove().exec();

		done();
	});
});