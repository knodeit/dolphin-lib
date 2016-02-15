/**
 * Created by Vadim on 11/23/2015.
 */
'use strict';

module.exports = function (err, req, res, next) {
    if (err && err.constructor && (err.constructor.name == 'KNValidationException' || err.constructor.name == 'KNMongoException')) {
        return res.status(400).send(err.getErrors());
    }

    if (err && err.constructor && (err.constructor.name == 'KNHttpException')) {
        return res.status(err.getStatus()).send(err.getError());
    }

    if (err && err.constructor && (err.constructor.name == 'Error')) {
        return res.status(400).send(err.message);
    }

    next(err);
};