/**
 * Created by petervandeput on 15/10/2015.
 */

'use strict';
var paypal = require('paypal-rest-sdk');
var Q = require('q');

function PayPal(options) {
    paypal.configure(options);
}


/**
 *
 * @param firstName
 * @param lastName
 * @param cardType
 * @param cardNumber
 * @param expirationMonth
 * @param expirationYear
 * @param cvv
 * @returns Promise
 */
PayPal.prototype.createCard = function (firstName, lastName, cardType, cardNumber, expirationMonth, expirationYear, cvv) {
    var deferred = Q.defer();
    var cardInfo = {
        type: cardType,
        number: cardNumber,
        expire_month: expirationMonth,
        expire_year: expirationYear,
        cvv2: cvv,
        first_name: firstName,
        last_name: lastName
    };
    paypal.creditCard.create(cardInfo, function (err, response) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(response);
    });
    return deferred.promise;
};


/**
 *
 * @param cardId
 * @returns Promise
 */
PayPal.prototype.deleteCard = function (cardId) {
    var deferred = Q.defer();
    try {
        paypal.creditCard.del(cardId, function (err) {
            if (err) {
                return Q.reject(err);
            }
            return Q.resolve();
        });
    } catch (e) {
        return Q.reject(e);
    }
    return deferred.promise;
};

/**
 *
 * @param cardId
 * @param amount
 * @param currency default USD
 * @param description - to be shown on credit card statement
 * @returns Promise
 */
PayPal.prototype.collectPayment = function (cardId, amount, currency, description) {
    var deferred = Q.defer();
    var cardInfo = {
        'intent': 'sale',
        'payer': {
            'payment_method': 'credit_card',
            'funding_instruments': [{
                'credit_card_token': {
                    'credit_card_id': cardId
                }
            }]
        },
        'transactions': [{
            'amount': {
                'currency': !currency ? 'USD' : currency,
                'total': amount
            },
            'description': description
        }]
    };
    paypal.payment.create(cardInfo, function (err, payment) {
        if (err) {
            return Q.reject(err);
        }
        return Q.resolve(payment);
    });
    return deferred.promise;
};

// export the class
module.exports = PayPal;