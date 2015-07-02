'use strict';

(function() {
	// Leaves Controller Spec
	describe('Leaves Controller Tests', function() {
		// Initialize global variables
		var LeavesController,
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

			// Initialize the Leaves controller.
			LeavesController = $controller('LeavesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Leave object fetched from XHR', inject(function(Leaves) {
			// Create sample Leave using the Leaves service
			var sampleLeave = new Leaves({
				name: 'New Leave'
			});

			// Create a sample Leaves array that includes the new Leave
			var sampleLeaves = [sampleLeave];

			// Set GET response
			$httpBackend.expectGET('leaves').respond(sampleLeaves);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.leaves).toEqualData(sampleLeaves);
		}));

		it('$scope.findOne() should create an array with one Leave object fetched from XHR using a leaveId URL parameter', inject(function(Leaves) {
			// Define a sample Leave object
			var sampleLeave = new Leaves({
				name: 'New Leave'
			});

			// Set the URL parameter
			$stateParams.leaveId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/leaves\/([0-9a-fA-F]{24})$/).respond(sampleLeave);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.leave).toEqualData(sampleLeave);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Leaves) {
			// Create a sample Leave object
			var sampleLeavePostData = new Leaves({
				name: 'New Leave'
			});

			// Create a sample Leave response
			var sampleLeaveResponse = new Leaves({
				_id: '525cf20451979dea2c000001',
				name: 'New Leave'
			});

			// Fixture mock form input values
			scope.name = 'New Leave';

			// Set POST response
			$httpBackend.expectPOST('leaves', sampleLeavePostData).respond(sampleLeaveResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Leave was created
			expect($location.path()).toBe('/leaves/' + sampleLeaveResponse._id);
		}));

		it('$scope.update() should update a valid Leave', inject(function(Leaves) {
			// Define a sample Leave put data
			var sampleLeavePutData = new Leaves({
				_id: '525cf20451979dea2c000001',
				name: 'New Leave'
			});

			// Mock Leave in scope
			scope.leave = sampleLeavePutData;

			// Set PUT response
			$httpBackend.expectPUT(/leaves\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/leaves/' + sampleLeavePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid leaveId and remove the Leave from the scope', inject(function(Leaves) {
			// Create new Leave object
			var sampleLeave = new Leaves({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Leaves array and include the Leave
			scope.leaves = [sampleLeave];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/leaves\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLeave);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.leaves.length).toBe(0);
		}));
	});
}());