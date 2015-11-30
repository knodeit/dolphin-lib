/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

var Q = require('q');
var validator = require('validator');

var KNRuleException = require('../../exceptions/KNRuleException');
var KNErrorCodes = require('../KNErrorCodes');

exports.validate = function (field, fieldParams, params, value) {
    if (!fieldParams) {
        return Q.reject(new KNRuleException(field, KNErrorCodes.stringLength, 'The validation rule was not set right: ' + field));
    }

    var message = 'Field "{field}" must be at least {min} characters long'.replace('{field}', field).replace('{min}', fieldParams.min);
    if (fieldParams.min !== undefined && fieldParams.max !== undefined) {
        message = 'Field "{field}" must be between {min}-{max} characters long'.replace('{field}', field).replace('{min}', fieldParams.min).replace('{max}', fieldParams.max);
    }

    if (!validator.isLength(value, fieldParams.min, fieldParams.max)) {
        return Q.reject(new KNRuleException(field, KNErrorCodes.notNAN, fieldParams && fieldParams.message ? fieldParams.message : message));
    }
    return Q.resolve();
};