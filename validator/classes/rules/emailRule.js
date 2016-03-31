/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

var Q = require('q');
var validator = require('validator');
var KNRuleException = require('../../exceptions/KNRuleException');
var KNErrorCodes = require('../KNErrorCodes');

exports.validate = function (field, fieldParams, params, value) {
    var message = 'The e-mail address is not valid';
    if (!validator.isEmail(value)) {
        return Q.reject(new KNRuleException(field, KNErrorCodes.email, fieldParams && fieldParams.message ? fieldParams.message : message));
    }
    return Q.resolve();
};