/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

var Q = require('q');
var KNRuleException = require('../../exceptions/KNRuleException');
var KNErrorCodes = require('../KNErrorCodes');
var validator = require('validator');

exports.validate = function (field, fieldParams, params, value) {
    var message = 'The field is required';
    try {
        if (validator.isBoolean(value) || validator.isNumeric(value)) {
            return Q.resolve();
        }

        if (value === undefined || value === null) {
            throw new Error();
        }

        if (value instanceof Array && value.length === 0) {
            throw new Error();
        }

        if ((typeof value == "string" || value instanceof String) && value.trim().length === 0) {
            throw new Error();
        }
    } catch (e) {
        return Q.reject(new KNRuleException(field, KNErrorCodes.required, fieldParams && fieldParams.message ? fieldParams.message : message));
    }

    return Q.resolve();
};