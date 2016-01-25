/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

var Q = require('q');
var validator = require('validator');

var KNRuleException = require('../../exceptions/KNRuleException');
var KNErrorCodes = require('../KNErrorCodes');

exports.validate = function (field, fieldParams, params, value) {
    if (!fieldParams || fieldParams.min === undefined || fieldParams.max ===undefined) {
        return Q.reject(new KNRuleException(field, KNErrorCodes.range, 'The validation rule was not set right: ' + field));
    }

    var message = 'Field "{field}" must be between {min} and {max}'.replace('{field}', field).replace('{min}', fieldParams.min).replace('{max}', fieldParams.max);

    try {
        if (parseInt(value) >= fieldParams.min && parseInt(value) <= fieldParams.max) {
            return Q.resolve();
        }

        throw new Error('Does not match');
    } catch (e) {
        return Q.reject(new KNRuleException(field, KNErrorCodes.notNAN, fieldParams && fieldParams.message ? fieldParams.message : message));
    }
};
