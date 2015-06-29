'use strict';

(function() {
	// Libraries Controller Spec
	describe('Libraries Controller Tests', function() {
		// Initialize global variables
		var LibrariesController,
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

			// Initialize the Libraries controller.
			LibrariesController = $controller('LibrariesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Library object fetched from XHR', inject(function(Libraries) {
			// Create sample Library using the Libraries service
			var sampleLibrary = new Libraries({
				name: 'New Library'
			});

			// Create a sample Libraries array that includes the new Library
			var sampleLibraries = [sampleLibrary];

			// Set GET response
			$httpBackend.expectGET('libraries').respond(sampleLibraries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.libraries).toEqualData(sampleLibraries);
		}));

		it('$scope.findOne() should create an array with one Library object fetched from XHR using a libraryId URL parameter', inject(function(Libraries) {
			// Define a sample Library object
			var sampleLibrary = new Libraries({
				name: 'New Library'
			});

			// Set the URL parameter
			$stateParams.libraryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/libraries\/([0-9a-fA-F]{24})$/).respond(sampleLibrary);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.library).toEqualData(sampleLibrary);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Libraries) {
			// Create a sample Library object
			var sampleLibraryPostData = new Libraries({
				name: 'New Library'
			});

			// Create a sample Library response
			var sampleLibraryResponse = new Libraries({
				_id: '525cf20451979dea2c000001',
				name: 'New Library'
			});

			// Fixture mock form input values
			scope.name = 'New Library';

			// Set POST response
			$httpBackend.expectPOST('libraries', sampleLibraryPostData).respond(sampleLibraryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Library was created
			expect($location.path()).toBe('/libraries/' + sampleLibraryResponse._id);
		}));

		it('$scope.update() should update a valid Library', inject(function(Libraries) {
			// Define a sample Library put data
			var sampleLibraryPutData = new Libraries({
				_id: '525cf20451979dea2c000001',
				name: 'New Library'
			});

			// Mock Library in scope
			scope.library = sampleLibraryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/libraries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/libraries/' + sampleLibraryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid libraryId and remove the Library from the scope', inject(function(Libraries) {
			// Create new Library object
			var sampleLibrary = new Libraries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Libraries array and include the Library
			scope.libraries = [sampleLibrary];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/libraries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLibrary);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.libraries.length).toBe(0);
		}));
	});
}());