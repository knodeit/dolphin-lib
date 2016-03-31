/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

var Q = require('q');
var validator = require('validator');
var KNRuleException = require('../../exceptions/KNRuleException');
var KNErrorCodes = require('../KNErrorCodes');

exports.validate = function (field, fieldParams, params, value) {
    var message = 'This field is not a type of boolean';
    if (!validator.isBoolean(value)) {
        return Q.reject(new KNRuleException(field, KNErrorCodes.boolean, fieldParams && fieldParams.message ? fieldParams.message : message));
    }
    return Q.resolve();
};