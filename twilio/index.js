/**
 * Created by petervandeput on 16/10/2015.
 */
'use strict';

var Q = require('q');


function Twilio(accountSID, authToken, phoneNumber) {
    this.phoneNumber = phoneNumber;
    this.client = require('twilio')(accountSID, authToken);
}


Twilio.prototype.sendSMS = function (toNumber, text) {
    var deferred = Q.defer();
    var message = {
        to: '+' + toNumber,
        from: this.phoneNumber,
        body: text
    };

    this.client.sendMessage(message, function (err, result) {
        if (err) {
            return deferred.reject(err);
        }
        return deferred.resolve(result);
    });
    return deferred.promise;
};


// export the class
module.exports = Twilio;