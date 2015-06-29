'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	TransportRoute = mongoose.model('TransportRoute');

/**
 * Globals
 */
var user, transportRoute;

/**
 * Unit tests
 */
describe('Transport route Model Unit Tests:', function() {
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
			transportRoute = new TransportRoute({
				name: 'Transport route Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return transportRoute.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			transportRoute.name = '';

			return transportRoute.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		TransportRoute.remove().exec();
		User.remove().exec();

		done();
	});
});