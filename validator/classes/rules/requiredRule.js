/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

var Q = require('q');
var KNRuleException = require('../../exceptions/KNRuleException');
var KNErrorCodes = require('../KNErrorCodes');
var validator = require('validator');

exports.validate = function (field, fieldParams, params, value) {
    var message = 'The field "{field}" is required'.replace('{field}', field);

    if (validator.isBoolean(value) || validator.isNumeric(value)) {
        return Q.resolve();
    }

    if ((value instanceof Array && value.length === 0) || (value === undefined || value == null || value.trim().length === 0)) {
        return Q.reject(new KNRuleException(field, KNErrorCodes.required, fieldParams && fieldParams.message ? fieldParams.message : message));
    }

    return Q.resolve();
};