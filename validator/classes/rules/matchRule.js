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
        return Q.resolve(new KNRuleException(field, KNErrorCodes.pattern, 'The validation rule was not set right: ' + field));
    }

    var message = 'The field "{field}" does not match the format "{pattern}"'.replace('{field}', field).replace('{pattern}', fieldParams.pattern);
    if (!validator.matches(value, fieldParams.pattern, fieldParams.modifiers)) {
        return Q.resolve(new KNRuleException(field, KNErrorCodes.notNAN, fieldParams && fieldParams.message ? fieldParams.message : message));
    }
    return Q.resolve();
};