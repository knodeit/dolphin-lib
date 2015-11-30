/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

var Q = require('q');
var moment = require('moment');
var KNRuleException = require('../../exceptions/KNRuleException');
var KNErrorCodes = require('../KNErrorCodes');

exports.validate = function (field, fieldParams, params, value) {
    var message = 'This value is not a date';
    if (!moment(value, fieldParams.format, true).isValid()) {
        return Q.reject(new KNRuleException(field, KNErrorCodes.date, fieldParams && fieldParams.message ? fieldParams.message : message));
    }
    return Q.resolve();
};