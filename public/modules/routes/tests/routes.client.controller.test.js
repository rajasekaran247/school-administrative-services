'use strict';

(function() {
	// Routes Controller Spec
	describe('Routes Controller Tests', function() {
		// Initialize global variables
		var RoutesController,
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

			// Initialize the Routes controller.
			RoutesController = $controller('RoutesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Route object fetched from XHR', inject(function(Routes) {
			// Create sample Route using the Routes service
			var sampleRoute = new Routes({
				name: 'New Route'
			});

			// Create a sample Routes array that includes the new Route
			var sampleRoutes = [sampleRoute];

			// Set GET response
			$httpBackend.expectGET('routes').respond(sampleRoutes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.routes).toEqualData(sampleRoutes);
		}));

		it('$scope.findOne() should create an array with one Route object fetched from XHR using a routeId URL parameter', inject(function(Routes) {
			// Define a sample Route object
			var sampleRoute = new Routes({
				name: 'New Route'
			});

			// Set the URL parameter
			$stateParams.routeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/routes\/([0-9a-fA-F]{24})$/).respond(sampleRoute);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.route).toEqualData(sampleRoute);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Routes) {
			// Create a sample Route object
			var sampleRoutePostData = new Routes({
				name: 'New Route'
			});

			// Create a sample Route response
			var sampleRouteResponse = new Routes({
				_id: '525cf20451979dea2c000001',
				name: 'New Route'
			});

			// Fixture mock form input values
			scope.name = 'New Route';

			// Set POST response
			$httpBackend.expectPOST('routes', sampleRoutePostData).respond(sampleRouteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Route was created
			expect($location.path()).toBe('/routes/' + sampleRouteResponse._id);
		}));

		it('$scope.update() should update a valid Route', inject(function(Routes) {
			// Define a sample Route put data
			var sampleRoutePutData = new Routes({
				_id: '525cf20451979dea2c000001',
				name: 'New Route'
			});

			// Mock Route in scope
			scope.route = sampleRoutePutData;

			// Set PUT response
			$httpBackend.expectPUT(/routes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/routes/' + sampleRoutePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid routeId and remove the Route from the scope', inject(function(Routes) {
			// Create new Route object
			var sampleRoute = new Routes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Routes array and include the Route
			scope.routes = [sampleRoute];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/routes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRoute);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.routes.length).toBe(0);
		}));
	});
}());