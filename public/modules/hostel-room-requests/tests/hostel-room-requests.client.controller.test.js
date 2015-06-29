'use strict';

(function() {
	// Hostel room requests Controller Spec
	describe('Hostel room requests Controller Tests', function() {
		// Initialize global variables
		var HostelRoomRequestsController,
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

			// Initialize the Hostel room requests controller.
			HostelRoomRequestsController = $controller('HostelRoomRequestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Hostel room request object fetched from XHR', inject(function(HostelRoomRequests) {
			// Create sample Hostel room request using the Hostel room requests service
			var sampleHostelRoomRequest = new HostelRoomRequests({
				name: 'New Hostel room request'
			});

			// Create a sample Hostel room requests array that includes the new Hostel room request
			var sampleHostelRoomRequests = [sampleHostelRoomRequest];

			// Set GET response
			$httpBackend.expectGET('hostel-room-requests').respond(sampleHostelRoomRequests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hostelRoomRequests).toEqualData(sampleHostelRoomRequests);
		}));

		it('$scope.findOne() should create an array with one Hostel room request object fetched from XHR using a hostelRoomRequestId URL parameter', inject(function(HostelRoomRequests) {
			// Define a sample Hostel room request object
			var sampleHostelRoomRequest = new HostelRoomRequests({
				name: 'New Hostel room request'
			});

			// Set the URL parameter
			$stateParams.hostelRoomRequestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/hostel-room-requests\/([0-9a-fA-F]{24})$/).respond(sampleHostelRoomRequest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hostelRoomRequest).toEqualData(sampleHostelRoomRequest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(HostelRoomRequests) {
			// Create a sample Hostel room request object
			var sampleHostelRoomRequestPostData = new HostelRoomRequests({
				name: 'New Hostel room request'
			});

			// Create a sample Hostel room request response
			var sampleHostelRoomRequestResponse = new HostelRoomRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Hostel room request'
			});

			// Fixture mock form input values
			scope.name = 'New Hostel room request';

			// Set POST response
			$httpBackend.expectPOST('hostel-room-requests', sampleHostelRoomRequestPostData).respond(sampleHostelRoomRequestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Hostel room request was created
			expect($location.path()).toBe('/hostel-room-requests/' + sampleHostelRoomRequestResponse._id);
		}));

		it('$scope.update() should update a valid Hostel room request', inject(function(HostelRoomRequests) {
			// Define a sample Hostel room request put data
			var sampleHostelRoomRequestPutData = new HostelRoomRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Hostel room request'
			});

			// Mock Hostel room request in scope
			scope.hostelRoomRequest = sampleHostelRoomRequestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/hostel-room-requests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/hostel-room-requests/' + sampleHostelRoomRequestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid hostelRoomRequestId and remove the Hostel room request from the scope', inject(function(HostelRoomRequests) {
			// Create new Hostel room request object
			var sampleHostelRoomRequest = new HostelRoomRequests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Hostel room requests array and include the Hostel room request
			scope.hostelRoomRequests = [sampleHostelRoomRequest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/hostel-room-requests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHostelRoomRequest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.hostelRoomRequests.length).toBe(0);
		}));
	});
}());