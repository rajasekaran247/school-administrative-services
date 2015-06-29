'use strict';

(function() {
	// Transport routes Controller Spec
	describe('Transport routes Controller Tests', function() {
		// Initialize global variables
		var TransportRoutesController,
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

			// Initialize the Transport routes controller.
			TransportRoutesController = $controller('TransportRoutesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Transport route object fetched from XHR', inject(function(TransportRoutes) {
			// Create sample Transport route using the Transport routes service
			var sampleTransportRoute = new TransportRoutes({
				name: 'New Transport route'
			});

			// Create a sample Transport routes array that includes the new Transport route
			var sampleTransportRoutes = [sampleTransportRoute];

			// Set GET response
			$httpBackend.expectGET('transport-routes').respond(sampleTransportRoutes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.transportRoutes).toEqualData(sampleTransportRoutes);
		}));

		it('$scope.findOne() should create an array with one Transport route object fetched from XHR using a transportRouteId URL parameter', inject(function(TransportRoutes) {
			// Define a sample Transport route object
			var sampleTransportRoute = new TransportRoutes({
				name: 'New Transport route'
			});

			// Set the URL parameter
			$stateParams.transportRouteId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/transport-routes\/([0-9a-fA-F]{24})$/).respond(sampleTransportRoute);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.transportRoute).toEqualData(sampleTransportRoute);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(TransportRoutes) {
			// Create a sample Transport route object
			var sampleTransportRoutePostData = new TransportRoutes({
				name: 'New Transport route'
			});

			// Create a sample Transport route response
			var sampleTransportRouteResponse = new TransportRoutes({
				_id: '525cf20451979dea2c000001',
				name: 'New Transport route'
			});

			// Fixture mock form input values
			scope.name = 'New Transport route';

			// Set POST response
			$httpBackend.expectPOST('transport-routes', sampleTransportRoutePostData).respond(sampleTransportRouteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Transport route was created
			expect($location.path()).toBe('/transport-routes/' + sampleTransportRouteResponse._id);
		}));

		it('$scope.update() should update a valid Transport route', inject(function(TransportRoutes) {
			// Define a sample Transport route put data
			var sampleTransportRoutePutData = new TransportRoutes({
				_id: '525cf20451979dea2c000001',
				name: 'New Transport route'
			});

			// Mock Transport route in scope
			scope.transportRoute = sampleTransportRoutePutData;

			// Set PUT response
			$httpBackend.expectPUT(/transport-routes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/transport-routes/' + sampleTransportRoutePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid transportRouteId and remove the Transport route from the scope', inject(function(TransportRoutes) {
			// Create new Transport route object
			var sampleTransportRoute = new TransportRoutes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Transport routes array and include the Transport route
			scope.transportRoutes = [sampleTransportRoute];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/transport-routes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTransportRoute);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.transportRoutes.length).toBe(0);
		}));
	});
}());