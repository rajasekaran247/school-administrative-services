'use strict';

(function() {
	// Admission eligibility rules Controller Spec
	describe('Admission eligibility rules Controller Tests', function() {
		// Initialize global variables
		var AdmissionEligibilityRulesController,
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

			// Initialize the Admission eligibility rules controller.
			AdmissionEligibilityRulesController = $controller('AdmissionEligibilityRulesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Admission eligibility rule object fetched from XHR', inject(function(AdmissionEligibilityRules) {
			// Create sample Admission eligibility rule using the Admission eligibility rules service
			var sampleAdmissionEligibilityRule = new AdmissionEligibilityRules({
				name: 'New Admission eligibility rule'
			});

			// Create a sample Admission eligibility rules array that includes the new Admission eligibility rule
			var sampleAdmissionEligibilityRules = [sampleAdmissionEligibilityRule];

			// Set GET response
			$httpBackend.expectGET('admission-eligibility-rules').respond(sampleAdmissionEligibilityRules);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.admissionEligibilityRules).toEqualData(sampleAdmissionEligibilityRules);
		}));

		it('$scope.findOne() should create an array with one Admission eligibility rule object fetched from XHR using a admissionEligibilityRuleId URL parameter', inject(function(AdmissionEligibilityRules) {
			// Define a sample Admission eligibility rule object
			var sampleAdmissionEligibilityRule = new AdmissionEligibilityRules({
				name: 'New Admission eligibility rule'
			});

			// Set the URL parameter
			$stateParams.admissionEligibilityRuleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/admission-eligibility-rules\/([0-9a-fA-F]{24})$/).respond(sampleAdmissionEligibilityRule);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.admissionEligibilityRule).toEqualData(sampleAdmissionEligibilityRule);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(AdmissionEligibilityRules) {
			// Create a sample Admission eligibility rule object
			var sampleAdmissionEligibilityRulePostData = new AdmissionEligibilityRules({
				name: 'New Admission eligibility rule'
			});

			// Create a sample Admission eligibility rule response
			var sampleAdmissionEligibilityRuleResponse = new AdmissionEligibilityRules({
				_id: '525cf20451979dea2c000001',
				name: 'New Admission eligibility rule'
			});

			// Fixture mock form input values
			scope.name = 'New Admission eligibility rule';

			// Set POST response
			$httpBackend.expectPOST('admission-eligibility-rules', sampleAdmissionEligibilityRulePostData).respond(sampleAdmissionEligibilityRuleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Admission eligibility rule was created
			expect($location.path()).toBe('/admission-eligibility-rules/' + sampleAdmissionEligibilityRuleResponse._id);
		}));

		it('$scope.update() should update a valid Admission eligibility rule', inject(function(AdmissionEligibilityRules) {
			// Define a sample Admission eligibility rule put data
			var sampleAdmissionEligibilityRulePutData = new AdmissionEligibilityRules({
				_id: '525cf20451979dea2c000001',
				name: 'New Admission eligibility rule'
			});

			// Mock Admission eligibility rule in scope
			scope.admissionEligibilityRule = sampleAdmissionEligibilityRulePutData;

			// Set PUT response
			$httpBackend.expectPUT(/admission-eligibility-rules\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/admission-eligibility-rules/' + sampleAdmissionEligibilityRulePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid admissionEligibilityRuleId and remove the Admission eligibility rule from the scope', inject(function(AdmissionEligibilityRules) {
			// Create new Admission eligibility rule object
			var sampleAdmissionEligibilityRule = new AdmissionEligibilityRules({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Admission eligibility rules array and include the Admission eligibility rule
			scope.admissionEligibilityRules = [sampleAdmissionEligibilityRule];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/admission-eligibility-rules\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAdmissionEligibilityRule);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.admissionEligibilityRules.length).toBe(0);
		}));
	});
}());