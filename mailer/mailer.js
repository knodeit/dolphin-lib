'use strict';

var Q = require('q');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var Mailer = module.exports = function (smtp, provider) {
    var self = this;
    self.globalParams = [];
    self.setSMTPOptions(smtp);
    self.setProvider(provider)
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
        self.globalParams.forEach(function (param) {
            params[param.name] = param.value;
        });

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
 * @param emailMessageFields
 * @returns {*}
 */
Mailer.prototype.send = function (templateName, params, emailMessageFields) {
    var deferred = Q.defer();
    var self = this;

    self.render(templateName, params).then(function (content) {
        emailMessageFields.html = content;
        if (!emailMessageFields.from) {
            emailMessageFields.from = self.smtp.emailFrom;
        }

        self.transport.sendMail(emailMessageFields, function (err, responseStatus) {
            if (err) {
                console.error('Mail not sent, html: ' + content, err);
                return deferred.reject(new Error('Email has not been sent'));
            }

            deferred.resolve({status: 'ok', response: responseStatus});
        });
    }).catch(function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
};


/**
 * Set global template params
 *
 * @param name
 * @param value
 */
Mailer.prototype.setVariable = function (name, value) {
    var self = this;
    if (!self.globalParams) {
        self.globalParams = [];
    }
    self.globalParams.push({name: name, value: value});
};

/**
 * Set SMTP options
 *
 * @param name
 * @param value
 */
Mailer.prototype.setSMTPOptions = function (smtp) {
    if (!smtp || !smtp.server || !smtp.port) {
        throw new Error('Incorrect SMTP settings');
    }

    var self = this;
    self.smtp = smtp;

    var mailOption = {
        host: self.smtp.server,
        port: self.smtp.port
    };
    if (self.smtp.username && self.smtp.password) {
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
    if (!provider) {
        throw new Error('Incorrect Mailer Content Provider');
    }

    this.provider = provider;
};
