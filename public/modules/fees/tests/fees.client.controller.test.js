'use strict';

(function() {
	// Fees Controller Spec
	describe('Fees Controller Tests', function() {
		// Initialize global variables
		var FeesController,
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

			// Initialize the Fees controller.
			FeesController = $controller('FeesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Fee object fetched from XHR', inject(function(Fees) {
			// Create sample Fee using the Fees service
			var sampleFee = new Fees({
				name: 'New Fee'
			});

			// Create a sample Fees array that includes the new Fee
			var sampleFees = [sampleFee];

			// Set GET response
			$httpBackend.expectGET('fees').respond(sampleFees);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fees).toEqualData(sampleFees);
		}));

		it('$scope.findOne() should create an array with one Fee object fetched from XHR using a feeId URL parameter', inject(function(Fees) {
			// Define a sample Fee object
			var sampleFee = new Fees({
				name: 'New Fee'
			});

			// Set the URL parameter
			$stateParams.feeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/fees\/([0-9a-fA-F]{24})$/).respond(sampleFee);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fee).toEqualData(sampleFee);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Fees) {
			// Create a sample Fee object
			var sampleFeePostData = new Fees({
				name: 'New Fee'
			});

			// Create a sample Fee response
			var sampleFeeResponse = new Fees({
				_id: '525cf20451979dea2c000001',
				name: 'New Fee'
			});

			// Fixture mock form input values
			scope.name = 'New Fee';

			// Set POST response
			$httpBackend.expectPOST('fees', sampleFeePostData).respond(sampleFeeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Fee was created
			expect($location.path()).toBe('/fees/' + sampleFeeResponse._id);
		}));

		it('$scope.update() should update a valid Fee', inject(function(Fees) {
			// Define a sample Fee put data
			var sampleFeePutData = new Fees({
				_id: '525cf20451979dea2c000001',
				name: 'New Fee'
			});

			// Mock Fee in scope
			scope.fee = sampleFeePutData;

			// Set PUT response
			$httpBackend.expectPUT(/fees\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/fees/' + sampleFeePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid feeId and remove the Fee from the scope', inject(function(Fees) {
			// Create new Fee object
			var sampleFee = new Fees({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Fees array and include the Fee
			scope.fees = [sampleFee];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/fees\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFee);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.fees.length).toBe(0);
		}));
	});
}());