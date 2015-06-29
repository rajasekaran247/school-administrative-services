'use strict';

(function() {
	// Admission applications Controller Spec
	describe('Admission applications Controller Tests', function() {
		// Initialize global variables
		var AdmissionApplicationsController,
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

			// Initialize the Admission applications controller.
			AdmissionApplicationsController = $controller('AdmissionApplicationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Admission application object fetched from XHR', inject(function(AdmissionApplications) {
			// Create sample Admission application using the Admission applications service
			var sampleAdmissionApplication = new AdmissionApplications({
				name: 'New Admission application'
			});

			// Create a sample Admission applications array that includes the new Admission application
			var sampleAdmissionApplications = [sampleAdmissionApplication];

			// Set GET response
			$httpBackend.expectGET('admission-applications').respond(sampleAdmissionApplications);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.admissionApplications).toEqualData(sampleAdmissionApplications);
		}));

		it('$scope.findOne() should create an array with one Admission application object fetched from XHR using a admissionApplicationId URL parameter', inject(function(AdmissionApplications) {
			// Define a sample Admission application object
			var sampleAdmissionApplication = new AdmissionApplications({
				name: 'New Admission application'
			});

			// Set the URL parameter
			$stateParams.admissionApplicationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/admission-applications\/([0-9a-fA-F]{24})$/).respond(sampleAdmissionApplication);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.admissionApplication).toEqualData(sampleAdmissionApplication);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(AdmissionApplications) {
			// Create a sample Admission application object
			var sampleAdmissionApplicationPostData = new AdmissionApplications({
				name: 'New Admission application'
			});

			// Create a sample Admission application response
			var sampleAdmissionApplicationResponse = new AdmissionApplications({
				_id: '525cf20451979dea2c000001',
				name: 'New Admission application'
			});

			// Fixture mock form input values
			scope.name = 'New Admission application';

			// Set POST response
			$httpBackend.expectPOST('admission-applications', sampleAdmissionApplicationPostData).respond(sampleAdmissionApplicationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Admission application was created
			expect($location.path()).toBe('/admission-applications/' + sampleAdmissionApplicationResponse._id);
		}));

		it('$scope.update() should update a valid Admission application', inject(function(AdmissionApplications) {
			// Define a sample Admission application put data
			var sampleAdmissionApplicationPutData = new AdmissionApplications({
				_id: '525cf20451979dea2c000001',
				name: 'New Admission application'
			});

			// Mock Admission application in scope
			scope.admissionApplication = sampleAdmissionApplicationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/admission-applications\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/admission-applications/' + sampleAdmissionApplicationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid admissionApplicationId and remove the Admission application from the scope', inject(function(AdmissionApplications) {
			// Create new Admission application object
			var sampleAdmissionApplication = new AdmissionApplications({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Admission applications array and include the Admission application
			scope.admissionApplications = [sampleAdmissionApplication];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/admission-applications\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAdmissionApplication);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.admissionApplications.length).toBe(0);
		}));
	});
}());