/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

module.exports = function RuleException(field, code, message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.field = field;
    this.code = code;
    this.message = message;
};

require('util').inherits(module.exports, Error);