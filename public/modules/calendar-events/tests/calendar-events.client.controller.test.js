'use strict';

(function() {
	// Calendar events Controller Spec
	describe('Calendar events Controller Tests', function() {
		// Initialize global variables
		var CalendarEventsController,
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

			// Initialize the Calendar events controller.
			CalendarEventsController = $controller('CalendarEventsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Calendar event object fetched from XHR', inject(function(CalendarEvents) {
			// Create sample Calendar event using the Calendar events service
			var sampleCalendarEvent = new CalendarEvents({
				name: 'New Calendar event'
			});

			// Create a sample Calendar events array that includes the new Calendar event
			var sampleCalendarEvents = [sampleCalendarEvent];

			// Set GET response
			$httpBackend.expectGET('calendar-events').respond(sampleCalendarEvents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.calendarEvents).toEqualData(sampleCalendarEvents);
		}));

		it('$scope.findOne() should create an array with one Calendar event object fetched from XHR using a calendarEventId URL parameter', inject(function(CalendarEvents) {
			// Define a sample Calendar event object
			var sampleCalendarEvent = new CalendarEvents({
				name: 'New Calendar event'
			});

			// Set the URL parameter
			$stateParams.calendarEventId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/calendar-events\/([0-9a-fA-F]{24})$/).respond(sampleCalendarEvent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.calendarEvent).toEqualData(sampleCalendarEvent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(CalendarEvents) {
			// Create a sample Calendar event object
			var sampleCalendarEventPostData = new CalendarEvents({
				name: 'New Calendar event'
			});

			// Create a sample Calendar event response
			var sampleCalendarEventResponse = new CalendarEvents({
				_id: '525cf20451979dea2c000001',
				name: 'New Calendar event'
			});

			// Fixture mock form input values
			scope.name = 'New Calendar event';

			// Set POST response
			$httpBackend.expectPOST('calendar-events', sampleCalendarEventPostData).respond(sampleCalendarEventResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Calendar event was created
			expect($location.path()).toBe('/calendar-events/' + sampleCalendarEventResponse._id);
		}));

		it('$scope.update() should update a valid Calendar event', inject(function(CalendarEvents) {
			// Define a sample Calendar event put data
			var sampleCalendarEventPutData = new CalendarEvents({
				_id: '525cf20451979dea2c000001',
				name: 'New Calendar event'
			});

			// Mock Calendar event in scope
			scope.calendarEvent = sampleCalendarEventPutData;

			// Set PUT response
			$httpBackend.expectPUT(/calendar-events\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/calendar-events/' + sampleCalendarEventPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid calendarEventId and remove the Calendar event from the scope', inject(function(CalendarEvents) {
			// Create new Calendar event object
			var sampleCalendarEvent = new CalendarEvents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Calendar events array and include the Calendar event
			scope.calendarEvents = [sampleCalendarEvent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/calendar-events\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCalendarEvent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.calendarEvents.length).toBe(0);
		}));
	});
}());