'use strict';

(function() {
	// Employee payrolls Controller Spec
	describe('Employee payrolls Controller Tests', function() {
		// Initialize global variables
		var EmployeePayrollsController,
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

			// Initialize the Employee payrolls controller.
			EmployeePayrollsController = $controller('EmployeePayrollsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Employee payroll object fetched from XHR', inject(function(EmployeePayrolls) {
			// Create sample Employee payroll using the Employee payrolls service
			var sampleEmployeePayroll = new EmployeePayrolls({
				name: 'New Employee payroll'
			});

			// Create a sample Employee payrolls array that includes the new Employee payroll
			var sampleEmployeePayrolls = [sampleEmployeePayroll];

			// Set GET response
			$httpBackend.expectGET('employee-payrolls').respond(sampleEmployeePayrolls);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employeePayrolls).toEqualData(sampleEmployeePayrolls);
		}));

		it('$scope.findOne() should create an array with one Employee payroll object fetched from XHR using a employeePayrollId URL parameter', inject(function(EmployeePayrolls) {
			// Define a sample Employee payroll object
			var sampleEmployeePayroll = new EmployeePayrolls({
				name: 'New Employee payroll'
			});

			// Set the URL parameter
			$stateParams.employeePayrollId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/employee-payrolls\/([0-9a-fA-F]{24})$/).respond(sampleEmployeePayroll);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employeePayroll).toEqualData(sampleEmployeePayroll);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(EmployeePayrolls) {
			// Create a sample Employee payroll object
			var sampleEmployeePayrollPostData = new EmployeePayrolls({
				name: 'New Employee payroll'
			});

			// Create a sample Employee payroll response
			var sampleEmployeePayrollResponse = new EmployeePayrolls({
				_id: '525cf20451979dea2c000001',
				name: 'New Employee payroll'
			});

			// Fixture mock form input values
			scope.name = 'New Employee payroll';

			// Set POST response
			$httpBackend.expectPOST('employee-payrolls', sampleEmployeePayrollPostData).respond(sampleEmployeePayrollResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Employee payroll was created
			expect($location.path()).toBe('/employee-payrolls/' + sampleEmployeePayrollResponse._id);
		}));

		it('$scope.update() should update a valid Employee payroll', inject(function(EmployeePayrolls) {
			// Define a sample Employee payroll put data
			var sampleEmployeePayrollPutData = new EmployeePayrolls({
				_id: '525cf20451979dea2c000001',
				name: 'New Employee payroll'
			});

			// Mock Employee payroll in scope
			scope.employeePayroll = sampleEmployeePayrollPutData;

			// Set PUT response
			$httpBackend.expectPUT(/employee-payrolls\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/employee-payrolls/' + sampleEmployeePayrollPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid employeePayrollId and remove the Employee payroll from the scope', inject(function(EmployeePayrolls) {
			// Create new Employee payroll object
			var sampleEmployeePayroll = new EmployeePayrolls({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Employee payrolls array and include the Employee payroll
			scope.employeePayrolls = [sampleEmployeePayroll];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/employee-payrolls\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEmployeePayroll);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.employeePayrolls.length).toBe(0);
		}));
	});
}());