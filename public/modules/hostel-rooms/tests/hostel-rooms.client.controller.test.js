'use strict';

(function() {
	// Hostel rooms Controller Spec
	describe('Hostel rooms Controller Tests', function() {
		// Initialize global variables
		var HostelRoomsController,
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

			// Initialize the Hostel rooms controller.
			HostelRoomsController = $controller('HostelRoomsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Hostel room object fetched from XHR', inject(function(HostelRooms) {
			// Create sample Hostel room using the Hostel rooms service
			var sampleHostelRoom = new HostelRooms({
				name: 'New Hostel room'
			});

			// Create a sample Hostel rooms array that includes the new Hostel room
			var sampleHostelRooms = [sampleHostelRoom];

			// Set GET response
			$httpBackend.expectGET('hostel-rooms').respond(sampleHostelRooms);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hostelRooms).toEqualData(sampleHostelRooms);
		}));

		it('$scope.findOne() should create an array with one Hostel room object fetched from XHR using a hostelRoomId URL parameter', inject(function(HostelRooms) {
			// Define a sample Hostel room object
			var sampleHostelRoom = new HostelRooms({
				name: 'New Hostel room'
			});

			// Set the URL parameter
			$stateParams.hostelRoomId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/hostel-rooms\/([0-9a-fA-F]{24})$/).respond(sampleHostelRoom);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hostelRoom).toEqualData(sampleHostelRoom);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(HostelRooms) {
			// Create a sample Hostel room object
			var sampleHostelRoomPostData = new HostelRooms({
				name: 'New Hostel room'
			});

			// Create a sample Hostel room response
			var sampleHostelRoomResponse = new HostelRooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Hostel room'
			});

			// Fixture mock form input values
			scope.name = 'New Hostel room';

			// Set POST response
			$httpBackend.expectPOST('hostel-rooms', sampleHostelRoomPostData).respond(sampleHostelRoomResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Hostel room was created
			expect($location.path()).toBe('/hostel-rooms/' + sampleHostelRoomResponse._id);
		}));

		it('$scope.update() should update a valid Hostel room', inject(function(HostelRooms) {
			// Define a sample Hostel room put data
			var sampleHostelRoomPutData = new HostelRooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Hostel room'
			});

			// Mock Hostel room in scope
			scope.hostelRoom = sampleHostelRoomPutData;

			// Set PUT response
			$httpBackend.expectPUT(/hostel-rooms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/hostel-rooms/' + sampleHostelRoomPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid hostelRoomId and remove the Hostel room from the scope', inject(function(HostelRooms) {
			// Create new Hostel room object
			var sampleHostelRoom = new HostelRooms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Hostel rooms array and include the Hostel room
			scope.hostelRooms = [sampleHostelRoom];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/hostel-rooms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHostelRoom);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.hostelRooms.length).toBe(0);
		}));
	});
}());