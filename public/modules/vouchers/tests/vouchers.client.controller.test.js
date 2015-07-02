'use strict';

(function() {
	// Vouchers Controller Spec
	describe('Vouchers Controller Tests', function() {
		// Initialize global variables
		var VouchersController,
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

			// Initialize the Vouchers controller.
			VouchersController = $controller('VouchersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Voucher object fetched from XHR', inject(function(Vouchers) {
			// Create sample Voucher using the Vouchers service
			var sampleVoucher = new Vouchers({
				name: 'New Voucher'
			});

			// Create a sample Vouchers array that includes the new Voucher
			var sampleVouchers = [sampleVoucher];

			// Set GET response
			$httpBackend.expectGET('vouchers').respond(sampleVouchers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vouchers).toEqualData(sampleVouchers);
		}));

		it('$scope.findOne() should create an array with one Voucher object fetched from XHR using a voucherId URL parameter', inject(function(Vouchers) {
			// Define a sample Voucher object
			var sampleVoucher = new Vouchers({
				name: 'New Voucher'
			});

			// Set the URL parameter
			$stateParams.voucherId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/vouchers\/([0-9a-fA-F]{24})$/).respond(sampleVoucher);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.voucher).toEqualData(sampleVoucher);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Vouchers) {
			// Create a sample Voucher object
			var sampleVoucherPostData = new Vouchers({
				name: 'New Voucher'
			});

			// Create a sample Voucher response
			var sampleVoucherResponse = new Vouchers({
				_id: '525cf20451979dea2c000001',
				name: 'New Voucher'
			});

			// Fixture mock form input values
			scope.name = 'New Voucher';

			// Set POST response
			$httpBackend.expectPOST('vouchers', sampleVoucherPostData).respond(sampleVoucherResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Voucher was created
			expect($location.path()).toBe('/vouchers/' + sampleVoucherResponse._id);
		}));

		it('$scope.update() should update a valid Voucher', inject(function(Vouchers) {
			// Define a sample Voucher put data
			var sampleVoucherPutData = new Vouchers({
				_id: '525cf20451979dea2c000001',
				name: 'New Voucher'
			});

			// Mock Voucher in scope
			scope.voucher = sampleVoucherPutData;

			// Set PUT response
			$httpBackend.expectPUT(/vouchers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/vouchers/' + sampleVoucherPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid voucherId and remove the Voucher from the scope', inject(function(Vouchers) {
			// Create new Voucher object
			var sampleVoucher = new Vouchers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Vouchers array and include the Voucher
			scope.vouchers = [sampleVoucher];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/vouchers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVoucher);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.vouchers.length).toBe(0);
		}));
	});
}());