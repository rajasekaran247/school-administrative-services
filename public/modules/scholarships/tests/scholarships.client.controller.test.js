'use strict';

(function() {
	// Scholarships Controller Spec
	describe('Scholarships Controller Tests', function() {
		// Initialize global variables
		var ScholarshipsController,
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

			// Initialize the Scholarships controller.
			ScholarshipsController = $controller('ScholarshipsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Scholarship object fetched from XHR', inject(function(Scholarships) {
			// Create sample Scholarship using the Scholarships service
			var sampleScholarship = new Scholarships({
				name: 'New Scholarship'
			});

			// Create a sample Scholarships array that includes the new Scholarship
			var sampleScholarships = [sampleScholarship];

			// Set GET response
			$httpBackend.expectGET('scholarships').respond(sampleScholarships);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.scholarships).toEqualData(sampleScholarships);
		}));

		it('$scope.findOne() should create an array with one Scholarship object fetched from XHR using a scholarshipId URL parameter', inject(function(Scholarships) {
			// Define a sample Scholarship object
			var sampleScholarship = new Scholarships({
				name: 'New Scholarship'
			});

			// Set the URL parameter
			$stateParams.scholarshipId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/scholarships\/([0-9a-fA-F]{24})$/).respond(sampleScholarship);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.scholarship).toEqualData(sampleScholarship);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Scholarships) {
			// Create a sample Scholarship object
			var sampleScholarshipPostData = new Scholarships({
				name: 'New Scholarship'
			});

			// Create a sample Scholarship response
			var sampleScholarshipResponse = new Scholarships({
				_id: '525cf20451979dea2c000001',
				name: 'New Scholarship'
			});

			// Fixture mock form input values
			scope.name = 'New Scholarship';

			// Set POST response
			$httpBackend.expectPOST('scholarships', sampleScholarshipPostData).respond(sampleScholarshipResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Scholarship was created
			expect($location.path()).toBe('/scholarships/' + sampleScholarshipResponse._id);
		}));

		it('$scope.update() should update a valid Scholarship', inject(function(Scholarships) {
			// Define a sample Scholarship put data
			var sampleScholarshipPutData = new Scholarships({
				_id: '525cf20451979dea2c000001',
				name: 'New Scholarship'
			});

			// Mock Scholarship in scope
			scope.scholarship = sampleScholarshipPutData;

			// Set PUT response
			$httpBackend.expectPUT(/scholarships\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/scholarships/' + sampleScholarshipPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid scholarshipId and remove the Scholarship from the scope', inject(function(Scholarships) {
			// Create new Scholarship object
			var sampleScholarship = new Scholarships({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Scholarships array and include the Scholarship
			scope.scholarships = [sampleScholarship];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/scholarships\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleScholarship);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.scholarships.length).toBe(0);
		}));
	});
}());