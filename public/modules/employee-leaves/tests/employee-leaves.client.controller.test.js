'use strict';

(function() {
	// Employee leaves Controller Spec
	describe('Employee leaves Controller Tests', function() {
		// Initialize global variables
		var EmployeeLeavesController,
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

			// Initialize the Employee leaves controller.
			EmployeeLeavesController = $controller('EmployeeLeavesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Employee leave object fetched from XHR', inject(function(EmployeeLeaves) {
			// Create sample Employee leave using the Employee leaves service
			var sampleEmployeeLeave = new EmployeeLeaves({
				name: 'New Employee leave'
			});

			// Create a sample Employee leaves array that includes the new Employee leave
			var sampleEmployeeLeaves = [sampleEmployeeLeave];

			// Set GET response
			$httpBackend.expectGET('employee-leaves').respond(sampleEmployeeLeaves);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employeeLeaves).toEqualData(sampleEmployeeLeaves);
		}));

		it('$scope.findOne() should create an array with one Employee leave object fetched from XHR using a employeeLeaveId URL parameter', inject(function(EmployeeLeaves) {
			// Define a sample Employee leave object
			var sampleEmployeeLeave = new EmployeeLeaves({
				name: 'New Employee leave'
			});

			// Set the URL parameter
			$stateParams.employeeLeaveId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/employee-leaves\/([0-9a-fA-F]{24})$/).respond(sampleEmployeeLeave);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employeeLeave).toEqualData(sampleEmployeeLeave);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(EmployeeLeaves) {
			// Create a sample Employee leave object
			var sampleEmployeeLeavePostData = new EmployeeLeaves({
				name: 'New Employee leave'
			});

			// Create a sample Employee leave response
			var sampleEmployeeLeaveResponse = new EmployeeLeaves({
				_id: '525cf20451979dea2c000001',
				name: 'New Employee leave'
			});

			// Fixture mock form input values
			scope.name = 'New Employee leave';

			// Set POST response
			$httpBackend.expectPOST('employee-leaves', sampleEmployeeLeavePostData).respond(sampleEmployeeLeaveResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Employee leave was created
			expect($location.path()).toBe('/employee-leaves/' + sampleEmployeeLeaveResponse._id);
		}));

		it('$scope.update() should update a valid Employee leave', inject(function(EmployeeLeaves) {
			// Define a sample Employee leave put data
			var sampleEmployeeLeavePutData = new EmployeeLeaves({
				_id: '525cf20451979dea2c000001',
				name: 'New Employee leave'
			});

			// Mock Employee leave in scope
			scope.employeeLeave = sampleEmployeeLeavePutData;

			// Set PUT response
			$httpBackend.expectPUT(/employee-leaves\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/employee-leaves/' + sampleEmployeeLeavePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid employeeLeaveId and remove the Employee leave from the scope', inject(function(EmployeeLeaves) {
			// Create new Employee leave object
			var sampleEmployeeLeave = new EmployeeLeaves({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Employee leaves array and include the Employee leave
			scope.employeeLeaves = [sampleEmployeeLeave];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/employee-leaves\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEmployeeLeave);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.employeeLeaves.length).toBe(0);
		}));
	});
}());