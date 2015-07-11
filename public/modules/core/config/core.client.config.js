'use strict';

// Configuring the Core module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
    Menus.addMenuItem('topbar', 'Admission', 'admission', 'dropdown');
    Menus.addMenuItem('topbar', 'Others', 'others', 'dropdown');
    Menus.addMenuItem('topbar', 'HR', 'hr', 'dropdown');
    Menus.addMenuItem('topbar', 'Accounting', 'accounting', 'dropdown');
    Menus.addMenuItem('topbar', 'Hostel', 'hostel', 'dropdown');
    Menus.addMenuItem('topbar', 'Library', 'library', 'dropdown');
    Menus.addMenuItem('topbar', 'General', 'general', 'dropdown');
    Menus.addMenuItem('topbar', 'Transport', 'transport', 'dropdown');

    Menus.addSubMenuItem('topbar', 'admission', 'Application', 'applications');
    Menus.addSubMenuItem('topbar', 'admission', 'Eligibility-Rule', 'eligibility-rules');
    Menus.addSubMenuItem('topbar', 'admission', 'Scholarship', 'scholarships');
    Menus.addSubMenuItem('topbar', 'admission', 'Student', 'students');
    Menus.addSubMenuItem('topbar', 'others', 'Event', 'calendar-events');
    Menus.addSubMenuItem('topbar', 'hr', 'Employee', 'employees');
    Menus.addSubMenuItem('topbar', 'hr', 'Leave', 'leaves');
    Menus.addSubMenuItem('topbar', 'hr', 'Loan', 'loans');
    Menus.addSubMenuItem('topbar', 'hr', 'Payroll', 'payrolls');
    Menus.addSubMenuItem('topbar', 'accounting', 'Fee', 'fees');
    Menus.addSubMenuItem('topbar', 'accounting', 'Voucher', 'vouchers');
    Menus.addSubMenuItem('topbar', 'hostel', 'Allotment', 'allotments');
    Menus.addSubMenuItem('topbar', 'hostel', 'Gate-Register', 'gate-registers');
    Menus.addSubMenuItem('topbar', 'hostel', 'Hostel', 'hostels');
    Menus.addSubMenuItem('topbar', 'hostel', 'Room', 'rooms');
    Menus.addSubMenuItem('topbar', 'hostel', 'Room-Request', 'room-requests');
    Menus.addSubMenuItem('topbar', 'library', 'Book', 'books');
    Menus.addSubMenuItem('topbar', 'library', 'Library', 'libraries');
    Menus.addSubMenuItem('topbar', 'library', 'Member', 'library-members');
    Menus.addSubMenuItem('topbar', 'general', 'Section', 'sections');
    Menus.addSubMenuItem('topbar', 'general', 'Class', 'grades');
    Menus.addSubMenuItem('topbar', 'general', 'Course', 'courses');
    Menus.addSubMenuItem('topbar', 'general', 'Subject', 'subjects');
    Menus.addSubMenuItem('topbar', 'general', 'Batch', 'batches');
    Menus.addSubMenuItem('topbar', 'transport', 'Charge', 'charges');
    Menus.addSubMenuItem('topbar', 'transport', 'Route', 'routes');
    Menus.addSubMenuItem('topbar', 'transport', 'Vehicle-Log', 'vehicle-logs');
    Menus.addSubMenuItem('topbar', 'transport', 'Vehicle', 'vehicles');
    
	}
]);