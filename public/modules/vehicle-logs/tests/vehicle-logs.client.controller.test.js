'use strict';

(function() {
	// Vehicle logs Controller Spec
	describe('Vehicle logs Controller Tests', function() {
		// Initialize global variables
		var VehicleLogsController,
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

			// Initialize the Vehicle logs controller.
			VehicleLogsController = $controller('VehicleLogsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Vehicle log object fetched from XHR', inject(function(VehicleLogs) {
			// Create sample Vehicle log using the Vehicle logs service
			var sampleVehicleLog = new VehicleLogs({
				name: 'New Vehicle log'
			});

			// Create a sample Vehicle logs array that includes the new Vehicle log
			var sampleVehicleLogs = [sampleVehicleLog];

			// Set GET response
			$httpBackend.expectGET('vehicle-logs').respond(sampleVehicleLogs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vehicleLogs).toEqualData(sampleVehicleLogs);
		}));

		it('$scope.findOne() should create an array with one Vehicle log object fetched from XHR using a vehicleLogId URL parameter', inject(function(VehicleLogs) {
			// Define a sample Vehicle log object
			var sampleVehicleLog = new VehicleLogs({
				name: 'New Vehicle log'
			});

			// Set the URL parameter
			$stateParams.vehicleLogId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/vehicle-logs\/([0-9a-fA-F]{24})$/).respond(sampleVehicleLog);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vehicleLog).toEqualData(sampleVehicleLog);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(VehicleLogs) {
			// Create a sample Vehicle log object
			var sampleVehicleLogPostData = new VehicleLogs({
				name: 'New Vehicle log'
			});

			// Create a sample Vehicle log response
			var sampleVehicleLogResponse = new VehicleLogs({
				_id: '525cf20451979dea2c000001',
				name: 'New Vehicle log'
			});

			// Fixture mock form input values
			scope.name = 'New Vehicle log';

			// Set POST response
			$httpBackend.expectPOST('vehicle-logs', sampleVehicleLogPostData).respond(sampleVehicleLogResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Vehicle log was created
			expect($location.path()).toBe('/vehicle-logs/' + sampleVehicleLogResponse._id);
		}));

		it('$scope.update() should update a valid Vehicle log', inject(function(VehicleLogs) {
			// Define a sample Vehicle log put data
			var sampleVehicleLogPutData = new VehicleLogs({
				_id: '525cf20451979dea2c000001',
				name: 'New Vehicle log'
			});

			// Mock Vehicle log in scope
			scope.vehicleLog = sampleVehicleLogPutData;

			// Set PUT response
			$httpBackend.expectPUT(/vehicle-logs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/vehicle-logs/' + sampleVehicleLogPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid vehicleLogId and remove the Vehicle log from the scope', inject(function(VehicleLogs) {
			// Create new Vehicle log object
			var sampleVehicleLog = new VehicleLogs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Vehicle logs array and include the Vehicle log
			scope.vehicleLogs = [sampleVehicleLog];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/vehicle-logs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVehicleLog);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.vehicleLogs.length).toBe(0);
		}));
	});
}());