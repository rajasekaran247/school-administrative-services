'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var libraryMembers = require('../../app/controllers/library-members.server.controller');

	// Library members Routes
	app.route('/library-members')
		.get(libraryMembers.list)
		.post(users.requiresLogin, libraryMembers.create);

	app.route('/library-members/:libraryMemberId')
		.get(libraryMembers.read)
		.put(users.requiresLogin, libraryMembers.hasAuthorization, libraryMembers.update)
		.delete(users.requiresLogin, libraryMembers.hasAuthorization, libraryMembers.delete);

	// Finish by binding the Library member middleware
	app.param('libraryMemberId', libraryMembers.libraryMemberByID);
};
