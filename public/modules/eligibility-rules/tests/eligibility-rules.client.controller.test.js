'use strict';

(function() {
	// Eligibility rules Controller Spec
	describe('Eligibility rules Controller Tests', function() {
		// Initialize global variables
		var EligibilityRulesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Eligibility rules controller.
			EligibilityRulesController = $controller('EligibilityRulesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Eligibility rule object fetched from XHR', inject(function(EligibilityRules) {
			// Create sample Eligibility rule using the Eligibility rules service
			var sampleEligibilityRule = new EligibilityRules({
				name: 'New Eligibility rule'
			});

			// Create a sample Eligibility rules array that includes the new Eligibility rule
			var sampleEligibilityRules = [sampleEligibilityRule];

			// Set GET response
			$httpBackend.expectGET('eligibility-rules').respond(sampleEligibilityRules);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.eligibilityRules).toEqualData(sampleEligibilityRules);
		}));

		it('$scope.findOne() should create an array with one Eligibility rule object fetched from XHR using a eligibilityRuleId URL parameter', inject(function(EligibilityRules) {
			// Define a sample Eligibility rule object
			var sampleEligibilityRule = new EligibilityRules({
				name: 'New Eligibility rule'
			});

			// Set the URL parameter
			$stateParams.eligibilityRuleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/eligibility-rules\/([0-9a-fA-F]{24})$/).respond(sampleEligibilityRule);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.eligibilityRule).toEqualData(sampleEligibilityRule);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(EligibilityRules) {
			// Create a sample Eligibility rule object
			var sampleEligibilityRulePostData = new EligibilityRules({
				name: 'New Eligibility rule'
			});

			// Create a sample Eligibility rule response
			var sampleEligibilityRuleResponse = new EligibilityRules({
				_id: '525cf20451979dea2c000001',
				name: 'New Eligibility rule'
			});

			// Fixture mock form input values
			scope.name = 'New Eligibility rule';

			// Set POST response
			$httpBackend.expectPOST('eligibility-rules', sampleEligibilityRulePostData).respond(sampleEligibilityRuleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Eligibility rule was created
			expect($location.path()).toBe('/eligibility-rules/' + sampleEligibilityRuleResponse._id);
		}));

		it('$scope.update() should update a valid Eligibility rule', inject(function(EligibilityRules) {
			// Define a sample Eligibility rule put data
			var sampleEligibilityRulePutData = new EligibilityRules({
				_id: '525cf20451979dea2c000001',
				name: 'New Eligibility rule'
			});

			// Mock Eligibility rule in scope
			scope.eligibilityRule = sampleEligibilityRulePutData;

			// Set PUT response
			$httpBackend.expectPUT(/eligibility-rules\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/eligibility-rules/' + sampleEligibilityRulePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid eligibilityRuleId and remove the Eligibility rule from the scope', inject(function(EligibilityRules) {
			// Create new Eligibility rule object
			var sampleEligibilityRule = new EligibilityRules({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Eligibility rules array and include the Eligibility rule
			scope.eligibilityRules = [sampleEligibilityRule];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/eligibility-rules\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEligibilityRule);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.eligibilityRules.length).toBe(0);
		}));
	});
}());