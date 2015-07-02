'use strict';

(function() {
	// Batches Controller Spec
	describe('Batches Controller Tests', function() {
		// Initialize global variables
		var BatchesController,
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

			// Initialize the Batches controller.
			BatchesController = $controller('BatchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Batch object fetched from XHR', inject(function(Batches) {
			// Create sample Batch using the Batches service
			var sampleBatch = new Batches({
				name: 'New Batch'
			});

			// Create a sample Batches array that includes the new Batch
			var sampleBatches = [sampleBatch];

			// Set GET response
			$httpBackend.expectGET('batches').respond(sampleBatches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.batches).toEqualData(sampleBatches);
		}));

		it('$scope.findOne() should create an array with one Batch object fetched from XHR using a batchId URL parameter', inject(function(Batches) {
			// Define a sample Batch object
			var sampleBatch = new Batches({
				name: 'New Batch'
			});

			// Set the URL parameter
			$stateParams.batchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/batches\/([0-9a-fA-F]{24})$/).respond(sampleBatch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.batch).toEqualData(sampleBatch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Batches) {
			// Create a sample Batch object
			var sampleBatchPostData = new Batches({
				name: 'New Batch'
			});

			// Create a sample Batch response
			var sampleBatchResponse = new Batches({
				_id: '525cf20451979dea2c000001',
				name: 'New Batch'
			});

			// Fixture mock form input values
			scope.name = 'New Batch';

			// Set POST response
			$httpBackend.expectPOST('batches', sampleBatchPostData).respond(sampleBatchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Batch was created
			expect($location.path()).toBe('/batches/' + sampleBatchResponse._id);
		}));

		it('$scope.update() should update a valid Batch', inject(function(Batches) {
			// Define a sample Batch put data
			var sampleBatchPutData = new Batches({
				_id: '525cf20451979dea2c000001',
				name: 'New Batch'
			});

			// Mock Batch in scope
			scope.batch = sampleBatchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/batches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/batches/' + sampleBatchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid batchId and remove the Batch from the scope', inject(function(Batches) {
			// Create new Batch object
			var sampleBatch = new Batches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Batches array and include the Batch
			scope.batches = [sampleBatch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/batches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBatch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.batches.length).toBe(0);
		}));
	});
}());