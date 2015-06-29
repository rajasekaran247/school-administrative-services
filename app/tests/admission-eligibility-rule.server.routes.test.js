'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	AdmissionEligibilityRule = mongoose.model('AdmissionEligibilityRule'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, admissionEligibilityRule;

/**
 * Admission eligibility rule routes tests
 */
describe('Admission eligibility rule CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Admission eligibility rule
		user.save(function() {
			admissionEligibilityRule = {
				name: 'Admission eligibility rule Name'
			};

			done();
		});
	});

	it('should be able to save Admission eligibility rule instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admission eligibility rule
				agent.post('/admission-eligibility-rules')
					.send(admissionEligibilityRule)
					.expect(200)
					.end(function(admissionEligibilityRuleSaveErr, admissionEligibilityRuleSaveRes) {
						// Handle Admission eligibility rule save error
						if (admissionEligibilityRuleSaveErr) done(admissionEligibilityRuleSaveErr);

						// Get a list of Admission eligibility rules
						agent.get('/admission-eligibility-rules')
							.end(function(admissionEligibilityRulesGetErr, admissionEligibilityRulesGetRes) {
								// Handle Admission eligibility rule save error
								if (admissionEligibilityRulesGetErr) done(admissionEligibilityRulesGetErr);

								// Get Admission eligibility rules list
								var admissionEligibilityRules = admissionEligibilityRulesGetRes.body;

								// Set assertions
								(admissionEligibilityRules[0].user._id).should.equal(userId);
								(admissionEligibilityRules[0].name).should.match('Admission eligibility rule Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Admission eligibility rule instance if not logged in', function(done) {
		agent.post('/admission-eligibility-rules')
			.send(admissionEligibilityRule)
			.expect(401)
			.end(function(admissionEligibilityRuleSaveErr, admissionEligibilityRuleSaveRes) {
				// Call the assertion callback
				done(admissionEligibilityRuleSaveErr);
			});
	});

	it('should not be able to save Admission eligibility rule instance if no name is provided', function(done) {
		// Invalidate name field
		admissionEligibilityRule.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admission eligibility rule
				agent.post('/admission-eligibility-rules')
					.send(admissionEligibilityRule)
					.expect(400)
					.end(function(admissionEligibilityRuleSaveErr, admissionEligibilityRuleSaveRes) {
						// Set message assertion
						(admissionEligibilityRuleSaveRes.body.message).should.match('Please fill Admission eligibility rule name');
						
						// Handle Admission eligibility rule save error
						done(admissionEligibilityRuleSaveErr);
					});
			});
	});

	it('should be able to update Admission eligibility rule instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admission eligibility rule
				agent.post('/admission-eligibility-rules')
					.send(admissionEligibilityRule)
					.expect(200)
					.end(function(admissionEligibilityRuleSaveErr, admissionEligibilityRuleSaveRes) {
						// Handle Admission eligibility rule save error
						if (admissionEligibilityRuleSaveErr) done(admissionEligibilityRuleSaveErr);

						// Update Admission eligibility rule name
						admissionEligibilityRule.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Admission eligibility rule
						agent.put('/admission-eligibility-rules/' + admissionEligibilityRuleSaveRes.body._id)
							.send(admissionEligibilityRule)
							.expect(200)
							.end(function(admissionEligibilityRuleUpdateErr, admissionEligibilityRuleUpdateRes) {
								// Handle Admission eligibility rule update error
								if (admissionEligibilityRuleUpdateErr) done(admissionEligibilityRuleUpdateErr);

								// Set assertions
								(admissionEligibilityRuleUpdateRes.body._id).should.equal(admissionEligibilityRuleSaveRes.body._id);
								(admissionEligibilityRuleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Admission eligibility rules if not signed in', function(done) {
		// Create new Admission eligibility rule model instance
		var admissionEligibilityRuleObj = new AdmissionEligibilityRule(admissionEligibilityRule);

		// Save the Admission eligibility rule
		admissionEligibilityRuleObj.save(function() {
			// Request Admission eligibility rules
			request(app).get('/admission-eligibility-rules')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Admission eligibility rule if not signed in', function(done) {
		// Create new Admission eligibility rule model instance
		var admissionEligibilityRuleObj = new AdmissionEligibilityRule(admissionEligibilityRule);

		// Save the Admission eligibility rule
		admissionEligibilityRuleObj.save(function() {
			request(app).get('/admission-eligibility-rules/' + admissionEligibilityRuleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', admissionEligibilityRule.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Admission eligibility rule instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admission eligibility rule
				agent.post('/admission-eligibility-rules')
					.send(admissionEligibilityRule)
					.expect(200)
					.end(function(admissionEligibilityRuleSaveErr, admissionEligibilityRuleSaveRes) {
						// Handle Admission eligibility rule save error
						if (admissionEligibilityRuleSaveErr) done(admissionEligibilityRuleSaveErr);

						// Delete existing Admission eligibility rule
						agent.delete('/admission-eligibility-rules/' + admissionEligibilityRuleSaveRes.body._id)
							.send(admissionEligibilityRule)
							.expect(200)
							.end(function(admissionEligibilityRuleDeleteErr, admissionEligibilityRuleDeleteRes) {
								// Handle Admission eligibility rule error error
								if (admissionEligibilityRuleDeleteErr) done(admissionEligibilityRuleDeleteErr);

								// Set assertions
								(admissionEligibilityRuleDeleteRes.body._id).should.equal(admissionEligibilityRuleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Admission eligibility rule instance if not signed in', function(done) {
		// Set Admission eligibility rule user 
		admissionEligibilityRule.user = user;

		// Create new Admission eligibility rule model instance
		var admissionEligibilityRuleObj = new AdmissionEligibilityRule(admissionEligibilityRule);

		// Save the Admission eligibility rule
		admissionEligibilityRuleObj.save(function() {
			// Try deleting Admission eligibility rule
			request(app).delete('/admission-eligibility-rules/' + admissionEligibilityRuleObj._id)
			.expect(401)
			.end(function(admissionEligibilityRuleDeleteErr, admissionEligibilityRuleDeleteRes) {
				// Set message assertion
				(admissionEligibilityRuleDeleteRes.body.message).should.match('User is not logged in');

				// Handle Admission eligibility rule error error
				done(admissionEligibilityRuleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		AdmissionEligibilityRule.remove().exec();
		done();
	});
});