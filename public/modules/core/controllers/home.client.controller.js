'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        // Some example string
        $scope.helloText = 'Welcome to School-Admissions';
        $scope.descriptionText = 'This is an web application for School-Admission. You can use it to Invite prospective students and register using on-line application, Approve or reject applications, Apply eligibility rules, Create rank list, Admission Process and workflow, Counseling process, Process application, Document scrutiny, Collect admission fees, Provisional roll number and provisional admission, Scholarship, fee waiver, Stipend, Allocate to a batch, Generate ID Card, Generate Admission Letter, and Send confirmation through SMS/E-Mail .';
	}
]);