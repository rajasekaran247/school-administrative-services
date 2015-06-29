'use strict';

(function() {
	// Gate registers Controller Spec
	describe('Gate registers Controller Tests', function() {
		// Initialize global variables
		var GateRegistersController,
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

			// Initialize the Gate registers controller.
			GateRegistersController = $controller('GateRegistersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gate register object fetched from XHR', inject(function(GateRegisters) {
			// Create sample Gate register using the Gate registers service
			var sampleGateRegister = new GateRegisters({
				name: 'New Gate register'
			});

			// Create a sample Gate registers array that includes the new Gate register
			var sampleGateRegisters = [sampleGateRegister];

			// Set GET response
			$httpBackend.expectGET('gate-registers').respond(sampleGateRegisters);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateRegisters).toEqualData(sampleGateRegisters);
		}));

		it('$scope.findOne() should create an array with one Gate register object fetched from XHR using a gateRegisterId URL parameter', inject(function(GateRegisters) {
			// Define a sample Gate register object
			var sampleGateRegister = new GateRegisters({
				name: 'New Gate register'
			});

			// Set the URL parameter
			$stateParams.gateRegisterId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gate-registers\/([0-9a-fA-F]{24})$/).respond(sampleGateRegister);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateRegister).toEqualData(sampleGateRegister);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(GateRegisters) {
			// Create a sample Gate register object
			var sampleGateRegisterPostData = new GateRegisters({
				name: 'New Gate register'
			});

			// Create a sample Gate register response
			var sampleGateRegisterResponse = new GateRegisters({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate register'
			});

			// Fixture mock form input values
			scope.name = 'New Gate register';

			// Set POST response
			$httpBackend.expectPOST('gate-registers', sampleGateRegisterPostData).respond(sampleGateRegisterResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gate register was created
			expect($location.path()).toBe('/gate-registers/' + sampleGateRegisterResponse._id);
		}));

		it('$scope.update() should update a valid Gate register', inject(function(GateRegisters) {
			// Define a sample Gate register put data
			var sampleGateRegisterPutData = new GateRegisters({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate register'
			});

			// Mock Gate register in scope
			scope.gateRegister = sampleGateRegisterPutData;

			// Set PUT response
			$httpBackend.expectPUT(/gate-registers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gate-registers/' + sampleGateRegisterPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gateRegisterId and remove the Gate register from the scope', inject(function(GateRegisters) {
			// Create new Gate register object
			var sampleGateRegister = new GateRegisters({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gate registers array and include the Gate register
			scope.gateRegisters = [sampleGateRegister];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gate-registers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGateRegister);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gateRegisters.length).toBe(0);
		}));
	});
}());