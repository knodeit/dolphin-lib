'use strict';
var stripe = require('stripe')('');
var Q = require('q');

function Stripe(apiKey) {
    stripe.setApiKey(apiKey);
}

/*____TRANSACTIONS____*/
Stripe.prototype.createTransaction = function(amount, currency, stripeToken, description) {
    var deferred = Q.defer();

    if (!amount || !currency || !stripeToken) {
        deferred.reject('missing parameter');
    }
    var charge = {
        amount: amount,
        currency: currency,
        source: stripeToken,
        description: description || ''
    };

    stripe.charges.create(charge, function(err, charge) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(charge);
    });

    return deferred.promise;
};

Stripe.prototype.getTransaction = function(chargeId) {
    var deferred = Q.defer();

    if (!chargeId) {
        return deferred.reject('chargeId required');
    }

    stripe.charges.retrieve(chargeId, function(err, charge) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(charge);
    });

    return deferred.promise;
};

Stripe.prototype.listTransactions = function(limit) {
    var deferred = Q.defer();

    var paginate = {
        limit: limit || 10
    };

    stripe.charges.list(paginate, function(err, charges) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(charges.data);
    });

    return deferred.promise;
};


/*____USERS____*/
Stripe.prototype.createUser = function(email, metadata, description) {
    var deferred = Q.defer();
    if (!email) {
        return deferred.reject('email required');
    }
    if (!metadata) {
        return deferred.reject('metadata required');
    }

    var customer = {
        email: email,
        metadata: metadata,
        description: description || ''

    };

    stripe.customers.create(customer, function(err, customer) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(customer);
    });

    return deferred.promise;
};

Stripe.prototype.getUser = function(customerId) {
    var deferred = Q.defer();

    if (!customerId) {
        return deferred.reject('customerId required');
    }

    stripe.customers.retrieve(customerId, function(err, customer) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(customer);
    });

    return deferred.promise;
};

Stripe.prototype.updateUser = function(customerId, userObject) {
    var deferred = Q.defer();
    if (!customerId) {
        return deferred.reject('customerId required');
    }
    if (!userObject) {
        return deferred.reject('userObject required');
    }


    stripe.customers.retrieve(customerId, userObject, function(err, customer) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(customer);
    });

    return deferred.promise;
};

Stripe.prototype.deleteUser = function(customerId) {
    var deferred = Q.defer();

    if (!customerId) {
        return deferred.reject('customerId required');
    }

    stripe.customers.del(customerId, function(err, confirmation) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(confirmation);
    });

    return deferred.promise;
};

Stripe.prototype.listUsers = function(limit) {
    var deferred = Q.defer();

    var paginate = {
        limit: limit || 10
    };

    stripe.customers.list(paginate, function(err, customers) {
        if (err) {
            return deferred.reject(err);
        }
        console.log(customers.data);
        return deferred.resolve(customers.data);
    });

    return deferred.promise;
};


/*____TOKENS____*/
Stripe.prototype.createToken = function(cardNumber, cvc, expMonth, expYear) {
    var deferred = Q.defer();

    if (!cardNumber || !cvc || !expMonth || !expYear) {
        return deferred.reject('missing parameter');
    }

    var cardObj = {
        card: {
            number: cardNumber,
            exp_month: expMonth,
            exp_year: expYear,
            cvc: cvc
        }
    };

    stripe.tokens.create(cardObj, function(err, token) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(token);
    });

    return deferred.promise;
};

Stripe.prototype.getToken = function(tokenId) {
    var deferred = Q.defer();

    if (!tokenId) {
        return deferred.reject('tokenId required');
    }

    stripe.tokens.retrieve(tokenId, function(err, token) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(token);
    });

    return deferred.promise;
};

/*____ACCOUNT____*/
Stripe.prototype.createAccount = function(managed, country, email) {
    var deferred = Q.defer();

    var account = {
        managed: managed,
        country: country,
        email: email
    };

    stripe.accounts.create(account, function(err, account) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(account);
    });

    return deferred.promise;
};


/*____CARDS____*/
Stripe.prototype.createCard = function(customerId, cardNumber, expMonth, expYear, cvc) {
    var deferred = Q.defer();

    if (!customerId || !cardNumber || !expMonth || !expYear || !cvc) {
        return deferred.reject('missing params');
    }

    var cardDetails = {
        source: {
            object: 'card',
            exp_month: expMonth,
            exp_year: expYear,
            number: cardNumber,
            cvc: cvc
        }
    };

    stripe.customers.createSource(customerId, cardDetails, function(err, card) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(card);
    });

    return deferred.promise;
};

Stripe.prototype.getCard = function(customerId, cardId) {
    var deferred = Q.defer();

    if (!cardId || !customerId) {
        return deferred.reject('cardId & customerId required');
    }

    stripe.customers.retrieveCard(customerId, cardId, function(err, card) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(card);
    });

    return deferred.promise;
};

Stripe.prototype.deleteCard = function(customerId, cardId) {
    var deferred = Q.defer();

    if (!cardId || !customerId) {
        return deferred.reject('cardId & customerId required');
    }

    stripe.customers.deleteCard(customerId, cardId, function(err, card) {
        if (err) {
            console.log(err);
            return deferred.reject(err);
        }
        console.log(card);
        return deferred.resolve(card);
    });

    return deferred.promise;
};

Stripe.prototype.listCards = function(customerId) {
    var deferred = Q.defer();

    if (!customerId) {
        return deferred.reject('customerId required');
    }

    stripe.customers.listCards(customerId, function(err, cards) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(cards.data);
    });

    return deferred.promise;
};

module.exports = Stripe;
