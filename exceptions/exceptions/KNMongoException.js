/**
 * Created by Vadim on 26.06.2015.
 */
'use strict';

function KNMongoValidationError(err) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.err = err;

    this.getErrors = function () {
        var errors = [];

        if (this.err.errors) {
            for (var index in this.err.errors) {
                if (!this.err.errors[index].path) {
                    continue;
                }
                errors.push({
                    field: this.err.errors[index].path,
                    message: this.err.errors[index].message,
                    value: this.err.errors[index].value
                });
            }
        }

        return errors;
    };
}

module.exports = KNMongoValidationError;
require('util').inherits(module.exports, Error);
