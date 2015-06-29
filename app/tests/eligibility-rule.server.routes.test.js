'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EligibilityRule = mongoose.model('EligibilityRule'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, eligibilityRule;

/**
 * Eligibility rule routes tests
 */
describe('Eligibility rule CRUD tests', function() {
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

		// Save a user to the test db and create new Eligibility rule
		user.save(function() {
			eligibilityRule = {
				name: 'Eligibility rule Name'
			};

			done();
		});
	});

	it('should be able to save Eligibility rule instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eligibility rule
				agent.post('/eligibility-rules')
					.send(eligibilityRule)
					.expect(200)
					.end(function(eligibilityRuleSaveErr, eligibilityRuleSaveRes) {
						// Handle Eligibility rule save error
						if (eligibilityRuleSaveErr) done(eligibilityRuleSaveErr);

						// Get a list of Eligibility rules
						agent.get('/eligibility-rules')
							.end(function(eligibilityRulesGetErr, eligibilityRulesGetRes) {
								// Handle Eligibility rule save error
								if (eligibilityRulesGetErr) done(eligibilityRulesGetErr);

								// Get Eligibility rules list
								var eligibilityRules = eligibilityRulesGetRes.body;

								// Set assertions
								(eligibilityRules[0].user._id).should.equal(userId);
								(eligibilityRules[0].name).should.match('Eligibility rule Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Eligibility rule instance if not logged in', function(done) {
		agent.post('/eligibility-rules')
			.send(eligibilityRule)
			.expect(401)
			.end(function(eligibilityRuleSaveErr, eligibilityRuleSaveRes) {
				// Call the assertion callback
				done(eligibilityRuleSaveErr);
			});
	});

	it('should not be able to save Eligibility rule instance if no name is provided', function(done) {
		// Invalidate name field
		eligibilityRule.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eligibility rule
				agent.post('/eligibility-rules')
					.send(eligibilityRule)
					.expect(400)
					.end(function(eligibilityRuleSaveErr, eligibilityRuleSaveRes) {
						// Set message assertion
						(eligibilityRuleSaveRes.body.message).should.match('Please fill Eligibility rule name');
						
						// Handle Eligibility rule save error
						done(eligibilityRuleSaveErr);
					});
			});
	});

	it('should be able to update Eligibility rule instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eligibility rule
				agent.post('/eligibility-rules')
					.send(eligibilityRule)
					.expect(200)
					.end(function(eligibilityRuleSaveErr, eligibilityRuleSaveRes) {
						// Handle Eligibility rule save error
						if (eligibilityRuleSaveErr) done(eligibilityRuleSaveErr);

						// Update Eligibility rule name
						eligibilityRule.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Eligibility rule
						agent.put('/eligibility-rules/' + eligibilityRuleSaveRes.body._id)
							.send(eligibilityRule)
							.expect(200)
							.end(function(eligibilityRuleUpdateErr, eligibilityRuleUpdateRes) {
								// Handle Eligibility rule update error
								if (eligibilityRuleUpdateErr) done(eligibilityRuleUpdateErr);

								// Set assertions
								(eligibilityRuleUpdateRes.body._id).should.equal(eligibilityRuleSaveRes.body._id);
								(eligibilityRuleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Eligibility rules if not signed in', function(done) {
		// Create new Eligibility rule model instance
		var eligibilityRuleObj = new EligibilityRule(eligibilityRule);

		// Save the Eligibility rule
		eligibilityRuleObj.save(function() {
			// Request Eligibility rules
			request(app).get('/eligibility-rules')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Eligibility rule if not signed in', function(done) {
		// Create new Eligibility rule model instance
		var eligibilityRuleObj = new EligibilityRule(eligibilityRule);

		// Save the Eligibility rule
		eligibilityRuleObj.save(function() {
			request(app).get('/eligibility-rules/' + eligibilityRuleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', eligibilityRule.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Eligibility rule instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eligibility rule
				agent.post('/eligibility-rules')
					.send(eligibilityRule)
					.expect(200)
					.end(function(eligibilityRuleSaveErr, eligibilityRuleSaveRes) {
						// Handle Eligibility rule save error
						if (eligibilityRuleSaveErr) done(eligibilityRuleSaveErr);

						// Delete existing Eligibility rule
						agent.delete('/eligibility-rules/' + eligibilityRuleSaveRes.body._id)
							.send(eligibilityRule)
							.expect(200)
							.end(function(eligibilityRuleDeleteErr, eligibilityRuleDeleteRes) {
								// Handle Eligibility rule error error
								if (eligibilityRuleDeleteErr) done(eligibilityRuleDeleteErr);

								// Set assertions
								(eligibilityRuleDeleteRes.body._id).should.equal(eligibilityRuleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Eligibility rule instance if not signed in', function(done) {
		// Set Eligibility rule user 
		eligibilityRule.user = user;

		// Create new Eligibility rule model instance
		var eligibilityRuleObj = new EligibilityRule(eligibilityRule);

		// Save the Eligibility rule
		eligibilityRuleObj.save(function() {
			// Try deleting Eligibility rule
			request(app).delete('/eligibility-rules/' + eligibilityRuleObj._id)
			.expect(401)
			.end(function(eligibilityRuleDeleteErr, eligibilityRuleDeleteRes) {
				// Set message assertion
				(eligibilityRuleDeleteRes.body.message).should.match('User is not logged in');

				// Handle Eligibility rule error error
				done(eligibilityRuleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		EligibilityRule.remove().exec();
		done();
	});
});