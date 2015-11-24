/**
 * Created by petervandeput on 15/10/2015.
 */

'use strict';
var paypal = require('paypal-rest-sdk');
var Q = require('q');

function PayPal(clientId, clientSecret, mode) {
    paypal.configure({
        client_id: clientId,
        client_secret: clientSecret,
        mode: mode
    });
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

        deferred.resolve(response);
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
    paypal.creditCard.del(cardId, function (err, response) {
        if (err) {
            return deferred.reject(err);
        }

        deferred.resolve(response);
    });
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
                'currency': currency ? currency : 'USD',
                'total': amount
            },
            'description': description
        }]
    };
    paypal.payment.create(cardInfo, function (err, payment) {
        if (err) {
            return deferred.reject(err);
        }

        deferred.resolve(payment);
    });
    return deferred.promise;
};

PayPal.prototype.makeDeposit = function (subject, email, currency, amount) {
    var deferred = Q.defer();
    var senderBatchId = Math.random().toString(36).substring(9);
    var create_payout_json = {
        'sender_batch_header': {
            'sender_batch_id': senderBatchId,
            'email_subject': subject
        },
        'items': [
            {
                'recipient_type': 'EMAIL',
                'amount': {
                    'value': amount,
                    'currency': currency ? currency : 'USD'
                },
                'receiver': email
            }
        ]
    };
    paypal.payout.create(create_payout_json, true, function (err, payout) {
        if (err) {
            return deferred.reject(err);
        }
        deferred.resolve(payout);
    });
    return deferred.promise;
};

// export the class
module.exports = PayPal;