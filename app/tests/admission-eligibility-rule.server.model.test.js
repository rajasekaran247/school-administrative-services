'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	AdmissionEligibilityRule = mongoose.model('AdmissionEligibilityRule');

/**
 * Globals
 */
var user, admissionEligibilityRule;

/**
 * Unit tests
 */
describe('Admission eligibility rule Model Unit Tests:', function() {
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
			admissionEligibilityRule = new AdmissionEligibilityRule({
				name: 'Admission eligibility rule Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return admissionEligibilityRule.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			admissionEligibilityRule.name = '';

			return admissionEligibilityRule.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		AdmissionEligibilityRule.remove().exec();
		User.remove().exec();

		done();
	});
});