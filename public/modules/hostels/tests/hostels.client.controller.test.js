'use strict';

(function() {
	// Hostels Controller Spec
	describe('Hostels Controller Tests', function() {
		// Initialize global variables
		var HostelsController,
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

			// Initialize the Hostels controller.
			HostelsController = $controller('HostelsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Hostel object fetched from XHR', inject(function(Hostels) {
			// Create sample Hostel using the Hostels service
			var sampleHostel = new Hostels({
				name: 'New Hostel'
			});

			// Create a sample Hostels array that includes the new Hostel
			var sampleHostels = [sampleHostel];

			// Set GET response
			$httpBackend.expectGET('hostels').respond(sampleHostels);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hostels).toEqualData(sampleHostels);
		}));

		it('$scope.findOne() should create an array with one Hostel object fetched from XHR using a hostelId URL parameter', inject(function(Hostels) {
			// Define a sample Hostel object
			var sampleHostel = new Hostels({
				name: 'New Hostel'
			});

			// Set the URL parameter
			$stateParams.hostelId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/hostels\/([0-9a-fA-F]{24})$/).respond(sampleHostel);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hostel).toEqualData(sampleHostel);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Hostels) {
			// Create a sample Hostel object
			var sampleHostelPostData = new Hostels({
				name: 'New Hostel'
			});

			// Create a sample Hostel response
			var sampleHostelResponse = new Hostels({
				_id: '525cf20451979dea2c000001',
				name: 'New Hostel'
			});

			// Fixture mock form input values
			scope.name = 'New Hostel';

			// Set POST response
			$httpBackend.expectPOST('hostels', sampleHostelPostData).respond(sampleHostelResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Hostel was created
			expect($location.path()).toBe('/hostels/' + sampleHostelResponse._id);
		}));

		it('$scope.update() should update a valid Hostel', inject(function(Hostels) {
			// Define a sample Hostel put data
			var sampleHostelPutData = new Hostels({
				_id: '525cf20451979dea2c000001',
				name: 'New Hostel'
			});

			// Mock Hostel in scope
			scope.hostel = sampleHostelPutData;

			// Set PUT response
			$httpBackend.expectPUT(/hostels\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/hostels/' + sampleHostelPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid hostelId and remove the Hostel from the scope', inject(function(Hostels) {
			// Create new Hostel object
			var sampleHostel = new Hostels({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Hostels array and include the Hostel
			scope.hostels = [sampleHostel];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/hostels\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHostel);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.hostels.length).toBe(0);
		}));
	});
}());