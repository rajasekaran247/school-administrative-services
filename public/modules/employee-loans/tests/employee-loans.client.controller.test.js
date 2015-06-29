'use strict';

(function() {
	// Employee loans Controller Spec
	describe('Employee loans Controller Tests', function() {
		// Initialize global variables
		var EmployeeLoansController,
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

			// Initialize the Employee loans controller.
			EmployeeLoansController = $controller('EmployeeLoansController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Employee loan object fetched from XHR', inject(function(EmployeeLoans) {
			// Create sample Employee loan using the Employee loans service
			var sampleEmployeeLoan = new EmployeeLoans({
				name: 'New Employee loan'
			});

			// Create a sample Employee loans array that includes the new Employee loan
			var sampleEmployeeLoans = [sampleEmployeeLoan];

			// Set GET response
			$httpBackend.expectGET('employee-loans').respond(sampleEmployeeLoans);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employeeLoans).toEqualData(sampleEmployeeLoans);
		}));

		it('$scope.findOne() should create an array with one Employee loan object fetched from XHR using a employeeLoanId URL parameter', inject(function(EmployeeLoans) {
			// Define a sample Employee loan object
			var sampleEmployeeLoan = new EmployeeLoans({
				name: 'New Employee loan'
			});

			// Set the URL parameter
			$stateParams.employeeLoanId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/employee-loans\/([0-9a-fA-F]{24})$/).respond(sampleEmployeeLoan);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employeeLoan).toEqualData(sampleEmployeeLoan);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(EmployeeLoans) {
			// Create a sample Employee loan object
			var sampleEmployeeLoanPostData = new EmployeeLoans({
				name: 'New Employee loan'
			});

			// Create a sample Employee loan response
			var sampleEmployeeLoanResponse = new EmployeeLoans({
				_id: '525cf20451979dea2c000001',
				name: 'New Employee loan'
			});

			// Fixture mock form input values
			scope.name = 'New Employee loan';

			// Set POST response
			$httpBackend.expectPOST('employee-loans', sampleEmployeeLoanPostData).respond(sampleEmployeeLoanResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Employee loan was created
			expect($location.path()).toBe('/employee-loans/' + sampleEmployeeLoanResponse._id);
		}));

		it('$scope.update() should update a valid Employee loan', inject(function(EmployeeLoans) {
			// Define a sample Employee loan put data
			var sampleEmployeeLoanPutData = new EmployeeLoans({
				_id: '525cf20451979dea2c000001',
				name: 'New Employee loan'
			});

			// Mock Employee loan in scope
			scope.employeeLoan = sampleEmployeeLoanPutData;

			// Set PUT response
			$httpBackend.expectPUT(/employee-loans\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/employee-loans/' + sampleEmployeeLoanPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid employeeLoanId and remove the Employee loan from the scope', inject(function(EmployeeLoans) {
			// Create new Employee loan object
			var sampleEmployeeLoan = new EmployeeLoans({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Employee loans array and include the Employee loan
			scope.employeeLoans = [sampleEmployeeLoan];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/employee-loans\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEmployeeLoan);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.employeeLoans.length).toBe(0);
		}));
	});
}());