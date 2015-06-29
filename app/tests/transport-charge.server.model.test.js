'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	TransportCharge = mongoose.model('TransportCharge');

/**
 * Globals
 */
var user, transportCharge;

/**
 * Unit tests
 */
describe('Transport charge Model Unit Tests:', function() {
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
			transportCharge = new TransportCharge({
				name: 'Transport charge Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return transportCharge.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			transportCharge.name = '';

			return transportCharge.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		TransportCharge.remove().exec();
		User.remove().exec();

		done();
	});
});