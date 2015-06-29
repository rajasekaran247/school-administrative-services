'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EligibilityRule = mongoose.model('EligibilityRule');

/**
 * Globals
 */
var user, eligibilityRule;

/**
 * Unit tests
 */
describe('Eligibility rule Model Unit Tests:', function() {
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
			eligibilityRule = new EligibilityRule({
				name: 'Eligibility rule Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return eligibilityRule.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			eligibilityRule.name = '';

			return eligibilityRule.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		EligibilityRule.remove().exec();
		User.remove().exec();

		done();
	});
});