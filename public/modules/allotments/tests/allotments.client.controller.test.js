'use strict';

(function() {
	// Allotments Controller Spec
	describe('Allotments Controller Tests', function() {
		// Initialize global variables
		var AllotmentsController,
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

			// Initialize the Allotments controller.
			AllotmentsController = $controller('AllotmentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Allotment object fetched from XHR', inject(function(Allotments) {
			// Create sample Allotment using the Allotments service
			var sampleAllotment = new Allotments({
				name: 'New Allotment'
			});

			// Create a sample Allotments array that includes the new Allotment
			var sampleAllotments = [sampleAllotment];

			// Set GET response
			$httpBackend.expectGET('allotments').respond(sampleAllotments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.allotments).toEqualData(sampleAllotments);
		}));

		it('$scope.findOne() should create an array with one Allotment object fetched from XHR using a allotmentId URL parameter', inject(function(Allotments) {
			// Define a sample Allotment object
			var sampleAllotment = new Allotments({
				name: 'New Allotment'
			});

			// Set the URL parameter
			$stateParams.allotmentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/allotments\/([0-9a-fA-F]{24})$/).respond(sampleAllotment);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.allotment).toEqualData(sampleAllotment);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Allotments) {
			// Create a sample Allotment object
			var sampleAllotmentPostData = new Allotments({
				name: 'New Allotment'
			});

			// Create a sample Allotment response
			var sampleAllotmentResponse = new Allotments({
				_id: '525cf20451979dea2c000001',
				name: 'New Allotment'
			});

			// Fixture mock form input values
			scope.name = 'New Allotment';

			// Set POST response
			$httpBackend.expectPOST('allotments', sampleAllotmentPostData).respond(sampleAllotmentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Allotment was created
			expect($location.path()).toBe('/allotments/' + sampleAllotmentResponse._id);
		}));

		it('$scope.update() should update a valid Allotment', inject(function(Allotments) {
			// Define a sample Allotment put data
			var sampleAllotmentPutData = new Allotments({
				_id: '525cf20451979dea2c000001',
				name: 'New Allotment'
			});

			// Mock Allotment in scope
			scope.allotment = sampleAllotmentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/allotments\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/allotments/' + sampleAllotmentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid allotmentId and remove the Allotment from the scope', inject(function(Allotments) {
			// Create new Allotment object
			var sampleAllotment = new Allotments({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Allotments array and include the Allotment
			scope.allotments = [sampleAllotment];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/allotments\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAllotment);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.allotments.length).toBe(0);
		}));
	});
}());