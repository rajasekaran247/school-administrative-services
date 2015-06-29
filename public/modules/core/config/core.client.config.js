'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Admission', 'admission', 'dropdown');
		Menus.addSubMenuItem('topbar', 'admission', 'Application', 'admission-applications');
    Menus.addSubMenuItem('topbar', 'admission', 'Eligibility-Rule', 'admission-eligibility-rule');
    Menus.addSubMenuItem('topbar', 'admission', 'Scholarship', 'admission-scholarship');
    Menus.addSubMenuItem('topbar', 'admission', 'Student', 'admission-student');
    Menus.addMenuItem('topbar', 'Others', 'others', 'dropdown');
    Menus.addSubMenuItem('topbar', 'others', 'Event', 'calendar-event');
    Menus.addMenuItem('topbar', 'HR', 'hr', 'dropdown');
    Menus.addSubMenuItem('topbar', 'hr', 'Employee', 'employee-employee');
    Menus.addSubMenuItem('topbar', 'hr', 'Leave', 'employee-leaves');
    Menus.addSubMenuItem('topbar', 'hr', 'Loan', 'employee-loans');
    Menus.addSubMenuItem('topbar', 'hr', 'Payroll', 'employee-payrolls');
    Menus.addMenuItem('topbar', 'Accounting', 'accounting', 'dropdown');
    Menus.addSubMenuItem('topbar', 'accounting', 'Fee', 'finance-fee');
    Menus.addSubMenuItem('topbar', 'accounting', 'Voucher', 'finance-voucher');
    Menus.addMenuItem('topbar', 'Hostel', 'hostel', 'dropdown');
    Menus.addSubMenuItem('topbar', 'hostel', 'Allotment', 'hostel-allotments');
    Menus.addSubMenuItem('topbar', 'hostel', 'Gate-Register', 'hostel-gate-register');
    Menus.addSubMenuItem('topbar', 'hostel', 'Hostel', 'hostel-hostel');
    Menus.addSubMenuItem('topbar', 'hostel', 'Room', 'hostel-room');
    Menus.addSubMenuItem('topbar', 'hostel', 'Room-Request', 'hostel-room-requests');
    Menus.addMenuItem('topbar', 'Library', 'library', 'dropdown');
    Menus.addSubMenuItem('topbar', 'library', 'Book', 'library-book');
    Menus.addSubMenuItem('topbar', 'library', 'Library', 'library-library');
    Menus.addSubMenuItem('topbar', 'library', 'Member', 'library-member');
    Menus.addMenuItem('topbar', 'General', 'general', 'dropdown');
    Menus.addSubMenuItem('topbar', 'general', 'Batch', 'master-batch');
    Menus.addSubMenuItem('topbar', 'general', 'Catalog', 'master-catalog');
    Menus.addSubMenuItem('topbar', 'general', 'Course', 'master-course');
    Menus.addSubMenuItem('topbar', 'general', 'Subject', 'master-subject');
    Menus.addMenuItem('topbar', 'Transport', 'transport', 'dropdown');
    Menus.addSubMenuItem('topbar', 'transport', 'Charge', 'transport-charges');
    Menus.addSubMenuItem('topbar', 'transport', 'Route', 'transport-route');
    Menus.addSubMenuItem('topbar', 'transport', 'Vehicle-Log', 'transport-vehicle-logs');
    Menus.addSubMenuItem('topbar', 'transport', 'Vehicle', 'transport-vehicles');
   
	}
]);