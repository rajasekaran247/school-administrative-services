'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	HostelAllotment = mongoose.model('HostelAllotment');

/**
 * Globals
 */
var user, hostelAllotment;

/**
 * Unit tests
 */
describe('Hostel allotment Model Unit Tests:', function() {
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
			hostelAllotment = new HostelAllotment({
				name: 'Hostel allotment Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return hostelAllotment.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			hostelAllotment.name = '';

			return hostelAllotment.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		HostelAllotment.remove().exec();
		User.remove().exec();

		done();
	});
});