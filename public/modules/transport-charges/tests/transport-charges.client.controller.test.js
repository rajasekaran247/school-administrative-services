'use strict';

(function() {
	// Transport charges Controller Spec
	describe('Transport charges Controller Tests', function() {
		// Initialize global variables
		var TransportChargesController,
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

			// Initialize the Transport charges controller.
			TransportChargesController = $controller('TransportChargesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Transport charge object fetched from XHR', inject(function(TransportCharges) {
			// Create sample Transport charge using the Transport charges service
			var sampleTransportCharge = new TransportCharges({
				name: 'New Transport charge'
			});

			// Create a sample Transport charges array that includes the new Transport charge
			var sampleTransportCharges = [sampleTransportCharge];

			// Set GET response
			$httpBackend.expectGET('transport-charges').respond(sampleTransportCharges);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.transportCharges).toEqualData(sampleTransportCharges);
		}));

		it('$scope.findOne() should create an array with one Transport charge object fetched from XHR using a transportChargeId URL parameter', inject(function(TransportCharges) {
			// Define a sample Transport charge object
			var sampleTransportCharge = new TransportCharges({
				name: 'New Transport charge'
			});

			// Set the URL parameter
			$stateParams.transportChargeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/transport-charges\/([0-9a-fA-F]{24})$/).respond(sampleTransportCharge);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.transportCharge).toEqualData(sampleTransportCharge);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(TransportCharges) {
			// Create a sample Transport charge object
			var sampleTransportChargePostData = new TransportCharges({
				name: 'New Transport charge'
			});

			// Create a sample Transport charge response
			var sampleTransportChargeResponse = new TransportCharges({
				_id: '525cf20451979dea2c000001',
				name: 'New Transport charge'
			});

			// Fixture mock form input values
			scope.name = 'New Transport charge';

			// Set POST response
			$httpBackend.expectPOST('transport-charges', sampleTransportChargePostData).respond(sampleTransportChargeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Transport charge was created
			expect($location.path()).toBe('/transport-charges/' + sampleTransportChargeResponse._id);
		}));

		it('$scope.update() should update a valid Transport charge', inject(function(TransportCharges) {
			// Define a sample Transport charge put data
			var sampleTransportChargePutData = new TransportCharges({
				_id: '525cf20451979dea2c000001',
				name: 'New Transport charge'
			});

			// Mock Transport charge in scope
			scope.transportCharge = sampleTransportChargePutData;

			// Set PUT response
			$httpBackend.expectPUT(/transport-charges\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/transport-charges/' + sampleTransportChargePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid transportChargeId and remove the Transport charge from the scope', inject(function(TransportCharges) {
			// Create new Transport charge object
			var sampleTransportCharge = new TransportCharges({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Transport charges array and include the Transport charge
			scope.transportCharges = [sampleTransportCharge];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/transport-charges\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTransportCharge);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.transportCharges.length).toBe(0);
		}));
	});
}());