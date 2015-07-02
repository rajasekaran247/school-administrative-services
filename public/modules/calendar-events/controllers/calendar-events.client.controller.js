'use strict';

// Calendar events controller
angular.module('calendar-events').controller('CalendarEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'CalendarEvents',
	function($scope, $stateParams, $location, Authentication, CalendarEvents) {
		$scope.authentication = Authentication;

		// Create new Calendar event
		$scope.create = function() {
			// Create new Calendar event object
			var calendarEvent = new CalendarEvents ({
				name: this.name
			});

			// Redirect after save
			calendarEvent.$save(function(response) {
				$location.path('calendar-events/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Calendar event
		$scope.remove = function(calendarEvent) {
			if ( calendarEvent ) { 
				calendarEvent.$remove();

				for (var i in $scope.calendarEvents) {
					if ($scope.calendarEvents [i] === calendarEvent) {
						$scope.calendarEvents.splice(i, 1);
					}
				}
			} else {
				$scope.calendarEvent.$remove(function() {
					$location.path('calendar-events');
				});
			}
		};

		// Update existing Calendar event
		$scope.update = function() {
			var calendarEvent = $scope.calendarEvent;

			calendarEvent.$update(function() {
				$location.path('calendar-events/' + calendarEvent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Calendar events
		$scope.find = function() {
			$scope.calendarEvents = CalendarEvents.query();
		};

		// Find existing Calendar event
		$scope.findOne = function() {
			$scope.calendarEvent = CalendarEvents.get({ 
				calendarEventId: $stateParams.calendarEventId
			});
		};
	}
]);