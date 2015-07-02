'use strict';

(function() {
	// Library members Controller Spec
	describe('Library members Controller Tests', function() {
		// Initialize global variables
		var LibraryMembersController,
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

			// Initialize the Library members controller.
			LibraryMembersController = $controller('LibraryMembersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Library member object fetched from XHR', inject(function(LibraryMembers) {
			// Create sample Library member using the Library members service
			var sampleLibraryMember = new LibraryMembers({
				name: 'New Library member'
			});

			// Create a sample Library members array that includes the new Library member
			var sampleLibraryMembers = [sampleLibraryMember];

			// Set GET response
			$httpBackend.expectGET('library-members').respond(sampleLibraryMembers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.libraryMembers).toEqualData(sampleLibraryMembers);
		}));

		it('$scope.findOne() should create an array with one Library member object fetched from XHR using a libraryMemberId URL parameter', inject(function(LibraryMembers) {
			// Define a sample Library member object
			var sampleLibraryMember = new LibraryMembers({
				name: 'New Library member'
			});

			// Set the URL parameter
			$stateParams.libraryMemberId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/library-members\/([0-9a-fA-F]{24})$/).respond(sampleLibraryMember);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.libraryMember).toEqualData(sampleLibraryMember);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(LibraryMembers) {
			// Create a sample Library member object
			var sampleLibraryMemberPostData = new LibraryMembers({
				name: 'New Library member'
			});

			// Create a sample Library member response
			var sampleLibraryMemberResponse = new LibraryMembers({
				_id: '525cf20451979dea2c000001',
				name: 'New Library member'
			});

			// Fixture mock form input values
			scope.name = 'New Library member';

			// Set POST response
			$httpBackend.expectPOST('library-members', sampleLibraryMemberPostData).respond(sampleLibraryMemberResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Library member was created
			expect($location.path()).toBe('/library-members/' + sampleLibraryMemberResponse._id);
		}));

		it('$scope.update() should update a valid Library member', inject(function(LibraryMembers) {
			// Define a sample Library member put data
			var sampleLibraryMemberPutData = new LibraryMembers({
				_id: '525cf20451979dea2c000001',
				name: 'New Library member'
			});

			// Mock Library member in scope
			scope.libraryMember = sampleLibraryMemberPutData;

			// Set PUT response
			$httpBackend.expectPUT(/library-members\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/library-members/' + sampleLibraryMemberPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid libraryMemberId and remove the Library member from the scope', inject(function(LibraryMembers) {
			// Create new Library member object
			var sampleLibraryMember = new LibraryMembers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Library members array and include the Library member
			scope.libraryMembers = [sampleLibraryMember];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/library-members\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLibraryMember);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.libraryMembers.length).toBe(0);
		}));
	});
}());