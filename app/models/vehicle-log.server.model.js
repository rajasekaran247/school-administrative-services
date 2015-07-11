'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Vehicle log Schema
 */
var VehicleLogSchema = new Schema({
	weekStartingDate: {
		type: Date,
		default: Date.now
	},
  vehicleNo: {
		type: String,
		default: '',
		trim: true
	},
  tripDetails: {
    tripDate: {type: Date}, 
    startingKmReading: {type: Number}, 
    endingKmReading: {type: Number}, 
    driverName: {type: String}
  },
  fuelDetails: {
    fuelBillDate: {type: Date}, 
    billNo: {type: Number}, 
    ltrs: {type: Number},
    amount: {type: Number}
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

mongoose.model('VehicleLog', VehicleLogSchema);