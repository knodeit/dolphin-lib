/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

var Q = require('q');
var KNRuleException = require('../../exceptions/KNRuleException');
var KNErrorCodes = require('../KNErrorCodes');

exports.validate = function (field, fieldParams, params, value) {
    var message = 'The field "{field}" is required'.replace('{field}', field);
    if (value === undefined) {
        return Q.resolve(new KNRuleException(field, KNErrorCodes.required, fieldParams && fieldParams.message ? fieldParams.message : message));
    }
    return Q.resolve();
};