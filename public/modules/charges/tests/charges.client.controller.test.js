'use strict';

(function() {
	// Charges Controller Spec
	describe('Charges Controller Tests', function() {
		// Initialize global variables
		var ChargesController,
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

			// Initialize the Charges controller.
			ChargesController = $controller('ChargesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Charge object fetched from XHR', inject(function(Charges) {
			// Create sample Charge using the Charges service
			var sampleCharge = new Charges({
				name: 'New Charge'
			});

			// Create a sample Charges array that includes the new Charge
			var sampleCharges = [sampleCharge];

			// Set GET response
			$httpBackend.expectGET('charges').respond(sampleCharges);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.charges).toEqualData(sampleCharges);
		}));

		it('$scope.findOne() should create an array with one Charge object fetched from XHR using a chargeId URL parameter', inject(function(Charges) {
			// Define a sample Charge object
			var sampleCharge = new Charges({
				name: 'New Charge'
			});

			// Set the URL parameter
			$stateParams.chargeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/charges\/([0-9a-fA-F]{24})$/).respond(sampleCharge);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.charge).toEqualData(sampleCharge);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Charges) {
			// Create a sample Charge object
			var sampleChargePostData = new Charges({
				name: 'New Charge'
			});

			// Create a sample Charge response
			var sampleChargeResponse = new Charges({
				_id: '525cf20451979dea2c000001',
				name: 'New Charge'
			});

			// Fixture mock form input values
			scope.name = 'New Charge';

			// Set POST response
			$httpBackend.expectPOST('charges', sampleChargePostData).respond(sampleChargeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Charge was created
			expect($location.path()).toBe('/charges/' + sampleChargeResponse._id);
		}));

		it('$scope.update() should update a valid Charge', inject(function(Charges) {
			// Define a sample Charge put data
			var sampleChargePutData = new Charges({
				_id: '525cf20451979dea2c000001',
				name: 'New Charge'
			});

			// Mock Charge in scope
			scope.charge = sampleChargePutData;

			// Set PUT response
			$httpBackend.expectPUT(/charges\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/charges/' + sampleChargePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid chargeId and remove the Charge from the scope', inject(function(Charges) {
			// Create new Charge object
			var sampleCharge = new Charges({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Charges array and include the Charge
			scope.charges = [sampleCharge];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/charges\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCharge);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.charges.length).toBe(0);
		}));
	});
}());