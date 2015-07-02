'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	VehicleLog = mongoose.model('VehicleLog');

/**
 * Globals
 */
var user, vehicleLog;

/**
 * Unit tests
 */
describe('Vehicle log Model Unit Tests:', function() {
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
			vehicleLog = new VehicleLog({
				name: 'Vehicle log Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return vehicleLog.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			vehicleLog.name = '';

			return vehicleLog.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		VehicleLog.remove().exec();
		User.remove().exec();

		done();
	});
});