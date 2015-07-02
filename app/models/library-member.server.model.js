'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Library member Schema
 */
var LibraryMemberSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Library member name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('LibraryMember', LibraryMemberSchema);