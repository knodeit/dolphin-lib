'use strict';

function KNValidationException(errors) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.errors = errors;

    this.getErrors = function () {
        return this.errors;
    };
}

module.exports = KNValidationException;
require('util').inherits(module.exports, Error);