'use strict';

(function() {
	// Catalogs Controller Spec
	describe('Catalogs Controller Tests', function() {
		// Initialize global variables
		var CatalogsController,
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

			// Initialize the Catalogs controller.
			CatalogsController = $controller('CatalogsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Catalog object fetched from XHR', inject(function(Catalogs) {
			// Create sample Catalog using the Catalogs service
			var sampleCatalog = new Catalogs({
				name: 'New Catalog'
			});

			// Create a sample Catalogs array that includes the new Catalog
			var sampleCatalogs = [sampleCatalog];

			// Set GET response
			$httpBackend.expectGET('catalogs').respond(sampleCatalogs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.catalogs).toEqualData(sampleCatalogs);
		}));

		it('$scope.findOne() should create an array with one Catalog object fetched from XHR using a catalogId URL parameter', inject(function(Catalogs) {
			// Define a sample Catalog object
			var sampleCatalog = new Catalogs({
				name: 'New Catalog'
			});

			// Set the URL parameter
			$stateParams.catalogId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/catalogs\/([0-9a-fA-F]{24})$/).respond(sampleCatalog);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.catalog).toEqualData(sampleCatalog);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Catalogs) {
			// Create a sample Catalog object
			var sampleCatalogPostData = new Catalogs({
				name: 'New Catalog'
			});

			// Create a sample Catalog response
			var sampleCatalogResponse = new Catalogs({
				_id: '525cf20451979dea2c000001',
				name: 'New Catalog'
			});

			// Fixture mock form input values
			scope.name = 'New Catalog';

			// Set POST response
			$httpBackend.expectPOST('catalogs', sampleCatalogPostData).respond(sampleCatalogResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Catalog was created
			expect($location.path()).toBe('/catalogs/' + sampleCatalogResponse._id);
		}));

		it('$scope.update() should update a valid Catalog', inject(function(Catalogs) {
			// Define a sample Catalog put data
			var sampleCatalogPutData = new Catalogs({
				_id: '525cf20451979dea2c000001',
				name: 'New Catalog'
			});

			// Mock Catalog in scope
			scope.catalog = sampleCatalogPutData;

			// Set PUT response
			$httpBackend.expectPUT(/catalogs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/catalogs/' + sampleCatalogPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid catalogId and remove the Catalog from the scope', inject(function(Catalogs) {
			// Create new Catalog object
			var sampleCatalog = new Catalogs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Catalogs array and include the Catalog
			scope.catalogs = [sampleCatalog];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/catalogs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCatalog);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.catalogs.length).toBe(0);
		}));
	});
}());