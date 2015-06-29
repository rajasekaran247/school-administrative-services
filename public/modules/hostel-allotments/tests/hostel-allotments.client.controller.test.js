'use strict';

(function() {
	// Hostel allotments Controller Spec
	describe('Hostel allotments Controller Tests', function() {
		// Initialize global variables
		var HostelAllotmentsController,
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

			// Initialize the Hostel allotments controller.
			HostelAllotmentsController = $controller('HostelAllotmentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Hostel allotment object fetched from XHR', inject(function(HostelAllotments) {
			// Create sample Hostel allotment using the Hostel allotments service
			var sampleHostelAllotment = new HostelAllotments({
				name: 'New Hostel allotment'
			});

			// Create a sample Hostel allotments array that includes the new Hostel allotment
			var sampleHostelAllotments = [sampleHostelAllotment];

			// Set GET response
			$httpBackend.expectGET('hostel-allotments').respond(sampleHostelAllotments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hostelAllotments).toEqualData(sampleHostelAllotments);
		}));

		it('$scope.findOne() should create an array with one Hostel allotment object fetched from XHR using a hostelAllotmentId URL parameter', inject(function(HostelAllotments) {
			// Define a sample Hostel allotment object
			var sampleHostelAllotment = new HostelAllotments({
				name: 'New Hostel allotment'
			});

			// Set the URL parameter
			$stateParams.hostelAllotmentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/hostel-allotments\/([0-9a-fA-F]{24})$/).respond(sampleHostelAllotment);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hostelAllotment).toEqualData(sampleHostelAllotment);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(HostelAllotments) {
			// Create a sample Hostel allotment object
			var sampleHostelAllotmentPostData = new HostelAllotments({
				name: 'New Hostel allotment'
			});

			// Create a sample Hostel allotment response
			var sampleHostelAllotmentResponse = new HostelAllotments({
				_id: '525cf20451979dea2c000001',
				name: 'New Hostel allotment'
			});

			// Fixture mock form input values
			scope.name = 'New Hostel allotment';

			// Set POST response
			$httpBackend.expectPOST('hostel-allotments', sampleHostelAllotmentPostData).respond(sampleHostelAllotmentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Hostel allotment was created
			expect($location.path()).toBe('/hostel-allotments/' + sampleHostelAllotmentResponse._id);
		}));

		it('$scope.update() should update a valid Hostel allotment', inject(function(HostelAllotments) {
			// Define a sample Hostel allotment put data
			var sampleHostelAllotmentPutData = new HostelAllotments({
				_id: '525cf20451979dea2c000001',
				name: 'New Hostel allotment'
			});

			// Mock Hostel allotment in scope
			scope.hostelAllotment = sampleHostelAllotmentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/hostel-allotments\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/hostel-allotments/' + sampleHostelAllotmentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid hostelAllotmentId and remove the Hostel allotment from the scope', inject(function(HostelAllotments) {
			// Create new Hostel allotment object
			var sampleHostelAllotment = new HostelAllotments({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Hostel allotments array and include the Hostel allotment
			scope.hostelAllotments = [sampleHostelAllotment];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/hostel-allotments\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHostelAllotment);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.hostelAllotments.length).toBe(0);
		}));
	});
}());