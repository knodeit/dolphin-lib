/**
 * Created by petervandeput on 16/10/2015.
 */
'use strict';

var Q = require('q');


function Twilio(accountSID,authToken,phoneNumber) {
    this.service = require('twilio');
    this.service.accountSID = accountSID;
    this.service.authToken = authToken;
    this.service.phoneNumber = phoneNumber;
}


Twilio.prototype.sendSMS = function (toNumber,text) {
    var deferred = Q.defer();
    var message = {
        to: '+' + toNumber,
        from: this.service.phoneNumber,
        body: text
    };

    var client = new this.service.RestClient(this.service.accountSID, this.service.authToken);
    client.sms.messages.create(message,function(err,result){
        if (err){
            return deferred.reject(err);
        }
        return deferred.resolve(result);
    });
    return deferred.promise;
};


// export the class
module.exports = Twilio;