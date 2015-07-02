'use strict';

(function() {
	// Room requests Controller Spec
	describe('Room requests Controller Tests', function() {
		// Initialize global variables
		var RoomRequestsController,
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

			// Initialize the Room requests controller.
			RoomRequestsController = $controller('RoomRequestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Room request object fetched from XHR', inject(function(RoomRequests) {
			// Create sample Room request using the Room requests service
			var sampleRoomRequest = new RoomRequests({
				name: 'New Room request'
			});

			// Create a sample Room requests array that includes the new Room request
			var sampleRoomRequests = [sampleRoomRequest];

			// Set GET response
			$httpBackend.expectGET('room-requests').respond(sampleRoomRequests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.roomRequests).toEqualData(sampleRoomRequests);
		}));

		it('$scope.findOne() should create an array with one Room request object fetched from XHR using a roomRequestId URL parameter', inject(function(RoomRequests) {
			// Define a sample Room request object
			var sampleRoomRequest = new RoomRequests({
				name: 'New Room request'
			});

			// Set the URL parameter
			$stateParams.roomRequestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/room-requests\/([0-9a-fA-F]{24})$/).respond(sampleRoomRequest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.roomRequest).toEqualData(sampleRoomRequest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(RoomRequests) {
			// Create a sample Room request object
			var sampleRoomRequestPostData = new RoomRequests({
				name: 'New Room request'
			});

			// Create a sample Room request response
			var sampleRoomRequestResponse = new RoomRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Room request'
			});

			// Fixture mock form input values
			scope.name = 'New Room request';

			// Set POST response
			$httpBackend.expectPOST('room-requests', sampleRoomRequestPostData).respond(sampleRoomRequestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Room request was created
			expect($location.path()).toBe('/room-requests/' + sampleRoomRequestResponse._id);
		}));

		it('$scope.update() should update a valid Room request', inject(function(RoomRequests) {
			// Define a sample Room request put data
			var sampleRoomRequestPutData = new RoomRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Room request'
			});

			// Mock Room request in scope
			scope.roomRequest = sampleRoomRequestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/room-requests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/room-requests/' + sampleRoomRequestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid roomRequestId and remove the Room request from the scope', inject(function(RoomRequests) {
			// Create new Room request object
			var sampleRoomRequest = new RoomRequests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Room requests array and include the Room request
			scope.roomRequests = [sampleRoomRequest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/room-requests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRoomRequest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.roomRequests.length).toBe(0);
		}));
	});
}());