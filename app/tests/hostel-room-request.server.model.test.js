'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	HostelRoomRequest = mongoose.model('HostelRoomRequest');

/**
 * Globals
 */
var user, hostelRoomRequest;

/**
 * Unit tests
 */
describe('Hostel room request Model Unit Tests:', function() {
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
			hostelRoomRequest = new HostelRoomRequest({
				name: 'Hostel room request Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return hostelRoomRequest.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			hostelRoomRequest.name = '';

			return hostelRoomRequest.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		HostelRoomRequest.remove().exec();
		User.remove().exec();

		done();
	});
});