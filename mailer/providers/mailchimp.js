'use strict';

var Q = require('q');
var mcapi = require("mailchimp-api/mailchimp");
var BaseMailProvider = require('./base');

var MailchimpProvider = module.exports = function (options) {
    BaseMailProvider.apply(this, arguments);
    this.mc = new mcapi.Mailchimp(options.key);
};

MailchimpProvider.prototype = Object.create(BaseMailProvider.prototype);
MailchimpProvider.prototype.constructor = MailchimpProvider;

MailchimpProvider.prototype.getContent = function (templateName, params) {
    var deferred = Q.defer();
    var self = this;

    self.mc.campaigns.content({
        cid: templateName,
        options: {
            view: params.view,
            email: {
                email: params.email,
                euid: params.euid,
                leid: params.leid
            }
        }
    }, function (content) {
        deferred.resolve(content.html);
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};