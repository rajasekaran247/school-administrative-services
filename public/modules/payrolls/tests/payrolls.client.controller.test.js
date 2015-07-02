'use strict';

(function() {
	// Payrolls Controller Spec
	describe('Payrolls Controller Tests', function() {
		// Initialize global variables
		var PayrollsController,
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

			// Initialize the Payrolls controller.
			PayrollsController = $controller('PayrollsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Payroll object fetched from XHR', inject(function(Payrolls) {
			// Create sample Payroll using the Payrolls service
			var samplePayroll = new Payrolls({
				name: 'New Payroll'
			});

			// Create a sample Payrolls array that includes the new Payroll
			var samplePayrolls = [samplePayroll];

			// Set GET response
			$httpBackend.expectGET('payrolls').respond(samplePayrolls);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.payrolls).toEqualData(samplePayrolls);
		}));

		it('$scope.findOne() should create an array with one Payroll object fetched from XHR using a payrollId URL parameter', inject(function(Payrolls) {
			// Define a sample Payroll object
			var samplePayroll = new Payrolls({
				name: 'New Payroll'
			});

			// Set the URL parameter
			$stateParams.payrollId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/payrolls\/([0-9a-fA-F]{24})$/).respond(samplePayroll);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.payroll).toEqualData(samplePayroll);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Payrolls) {
			// Create a sample Payroll object
			var samplePayrollPostData = new Payrolls({
				name: 'New Payroll'
			});

			// Create a sample Payroll response
			var samplePayrollResponse = new Payrolls({
				_id: '525cf20451979dea2c000001',
				name: 'New Payroll'
			});

			// Fixture mock form input values
			scope.name = 'New Payroll';

			// Set POST response
			$httpBackend.expectPOST('payrolls', samplePayrollPostData).respond(samplePayrollResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Payroll was created
			expect($location.path()).toBe('/payrolls/' + samplePayrollResponse._id);
		}));

		it('$scope.update() should update a valid Payroll', inject(function(Payrolls) {
			// Define a sample Payroll put data
			var samplePayrollPutData = new Payrolls({
				_id: '525cf20451979dea2c000001',
				name: 'New Payroll'
			});

			// Mock Payroll in scope
			scope.payroll = samplePayrollPutData;

			// Set PUT response
			$httpBackend.expectPUT(/payrolls\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/payrolls/' + samplePayrollPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid payrollId and remove the Payroll from the scope', inject(function(Payrolls) {
			// Create new Payroll object
			var samplePayroll = new Payrolls({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Payrolls array and include the Payroll
			scope.payrolls = [samplePayroll];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/payrolls\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePayroll);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.payrolls.length).toBe(0);
		}));
	});
}());