/**
 * Created by petervandeput on 15/10/2015.
 */

'use strict';
var apn = require('apn');
var Q = require('q');

function Apns(mode, key, cert) {
    this.service = new apn.connection({
        production: mode,
        key: key,
        cert: cert
    });

    this.service.on('connected', function () {
        console.log('APNS SERVER Connected');
    });

    this.service.on('transmitted', function (notification, device) {
        console.log('APNS SERVER  Notification transmitted to:' + device.token.toString('hex'));
    });

    this.service.on('transmissionError', function (errCode, notification, device) {
        console.error('APNS SERVER  Notification caused error: ' + errCode + ' for device ', device, notification);
        if (errCode == 1) {
            console.log('Processing error');
        }
        if (errCode == 2) {
            console.log('Missing device token');
        }
        if (errCode == 3) {
            console.log('Missing topic');
        }
        if (errCode == 4) {
            console.log('Missing payload');
        }
        if (errCode == 5) {
            console.log('Invalid token size');
        }
        if (errCode == 6) {
            console.log('Invalid topic size');
        }
        if (errCode == 7) {
            console.log('Invalid payload size');
        }
        if (errCode == 8) {
            console.log('APNS SERVER  A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox');
        }
        if (errCode == 513) {
            console.log('Certificate has expired');
        }
    });

    this.service.on('error', function (err) {
        console.log('APNS SERVER - ' + err);
    });

    this.service.on('timeout', function () {
        console.log('APNS SERVER  Connection Timeout');
    });

    this.service.on('disconnected', function () {
        console.log('APNS SERVER  Disconnected from APNS');
    });
}


Apns.prototype.sendMessage = function (deviceToken, alert, payload, sound, badge) {
    try {
        var note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600;
        note.badge = badge;
        note.sound = sound;
        note.alert = alert;
        note.payload = payload;
        this.service.pushNotification(note, deviceToken);
        return Q.resolve();
    } catch (e) {
        return Q.reject(e);
    }
};

// export the class
module.exports = Apns;
