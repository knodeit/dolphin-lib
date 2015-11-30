/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

var Q = require('q');
var KNRuleException = require('../../exceptions/KNRuleException');
var KNErrorCodes = require('../KNErrorCodes');

exports.validate = function (field, fieldParams, params, value) {
    var message = 'The field "{field}" must be a number'.replace('{field}', field);
    if (isNaN(value) === true) {
        return Q.reject(new KNRuleException(field, KNErrorCodes.notNAN, fieldParams && fieldParams.message ? fieldParams.message : message));
    }
    return Q.resolve();
};