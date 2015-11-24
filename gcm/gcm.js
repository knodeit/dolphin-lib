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
    try {
        var messageToSend = new gcm.Message( );
        messageToSend.addNew_DataObject(content);
        messageToSend.addNew_RegistrationId(registrationId);
        this.service.send(messageToSend, function(err, response) {
            if (err){
                return Q.reject(err);
            }
            return Q.resolve(response);
        });
    } catch (e) {
        return Q.reject(e);
    }
};

// export the class
module.exports = Gcm;