'use strict';

var Q = require('q');
var mandrill = require('mandrill-api/mandrill');
var BaseMailProvider = require('./base');

var MandrillProvider = module.exports = function (options) {
    BaseMailProvider.apply(this, arguments);
    this.mandrillClient = new mandrill.Mandrill(options.key);
};

MandrillProvider.prototype = Object.create(BaseMailProvider.prototype);
MandrillProvider.prototype.constructor = MandrillProvider;

MandrillProvider.prototype.getContent = function (templateName, params) {
    var deferred = Q.defer();
    var self = this;
    self.mandrillClient.templates.info({name: templateName}, function (result) {
        var merge_vars = [];
        if (params instanceof Array) {
            merge_vars = params;
        } else {
            for (var key in params) {
                merge_vars.push({
                    name: key,
                    content: params[key]
                });
            }
        }
        self.mandrillClient.templates.render({
            template_name: templateName,
            template_content: [{
                name: 'main',
                content: result.code
            }],
            merge_vars: merge_vars
        }, function (content) {
            deferred.resolve(content.html);
        }, function (err) {
            deferred.reject(err);
        });
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
};