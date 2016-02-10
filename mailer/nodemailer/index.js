'use strict';

var Q = require('q');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var Mailer = module.exports = function (smtp, provider) {
    this.provider = provider;
    this.smtp = smtp;

    var mailOption = {
        host: this.smtp.server,
        port: this.smtp.port,
        emailFrom: this.smtp.emailFrom
    };

    if (this.smtp.useAuthentication && this.smtp.username) {
        mailOption.auth = {
            user: this.smtp.username,
            pass: this.smtp.password
        };
    }

    this.transport = nodemailer.createTransport(smtpTransport(mailOption));
};

/**
 * Render template
 *
 * @param templateName
 * @param params
 * @returns {*}
 */
Mailer.prototype.render = function (templateName, params) {
    var deferred = Q.defer();
    var self = this;

    if (self.provider.getContent && (typeof self.provider.getContent === 'function')) {
        self.provider.getContent(templateName, params).then(function (content) {
            deferred.resolve(content);
        }).catch(function (err) {
            deferred.reject(err);
        });
    } else {
        deferred.reject(new Error('Uncorrect Mailer Content Provider'));
    }

    return deferred.promise;
};

/**
 * Send email
 *
 * @param templateName
 * @param params
 * @returns {*}
 */
Mailer.prototype.send = function (templateName, params) {
    var deferred = Q.defer();
    var self = this;

    if (self.provider.getContent && (typeof self.provider.getContent === 'function')) {
        self.provider.getContent(templateName, params).then(function (content) {
            params.html = content;
            self.transport.sendMail(params, function (err, responseStatus) {
                if (err) {
                    console.error('Mail not sent, html: ' + content, err);
                    return deferred.reject(new Error('Email has not been sent'));
                }

                deferred.resolve({status: 'ok', response: responseStatus});
            });


            deferred.resolve(result);
        }).catch(function (err) {
            deferred.reject(err);
        });
    } else {
        deferred.reject(new Error('Uncorrect Mailer Content Provider'));
    }

    return deferred.promise;
};

/**
 * Set SMTP option
 *
 * @param name
 * @param value
 */
Mailer.prototype.setVariable = function (name, value) {
    var self = this;
    self.smtp[name] = value;

    var mailOption = {
        host: self.smtp.server,
        port: self.smtp.port,
        emailFrom: self.smtp.emailFrom
    };
    if (self.smtp.useAuthentication && self.smtp.username) {
        mailOption.auth = {
            user: self.smtp.username,
            pass: self.smtp.password
        };
    }
    this.transport = nodemailer.createTransport(smtpTransport(mailOption));
};

/**
 * Set Mailer Content Provider
 *
 * @param provider
 */
Mailer.prototype.setProvider = function (provider) {
    this.provider = provider;
};
