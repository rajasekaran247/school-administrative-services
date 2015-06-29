'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	HostelRoom = mongoose.model('HostelRoom');

/**
 * Globals
 */
var user, hostelRoom;

/**
 * Unit tests
 */
describe('Hostel room Model Unit Tests:', function() {
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
			hostelRoom = new HostelRoom({
				name: 'Hostel room Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return hostelRoom.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			hostelRoom.name = '';

			return hostelRoom.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		HostelRoom.remove().exec();
		User.remove().exec();

		done();
	});
});