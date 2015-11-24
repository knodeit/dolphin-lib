/**
 * Created by petervandeput on 15/10/2015.
 */

'use strict';
var gcm = require('android-gcm');
var Q = require('q');

function Gcm(apiKey) {
    this.service = new gcm.AndroidGcm(apiKey);
}

Gcm.prototype.sendMessage = function (registrationId, content) {
    var deferred = Q.defer();
    try {
        var messageToSend = new gcm.Message( );
        messageToSend.addNew_DataObject(content);
        messageToSend.addNew_RegistrationId(registrationId);
        this.service.send(messageToSend, function(err, response) {
            if (err){
                return deferred.reject(err);
            }
            return deferred.resolve(response);
        });
    } catch (e) {
        return Q.reject(e);
    }
    return deferred.promise;
};

// export the class
module.exports = Gcm;