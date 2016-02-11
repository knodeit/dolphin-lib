'use strict';

var Q = require('q');
var Handlebars = require('handlebars');
var BaseMailProvider = require('./base');

var DBProvider = module.exports = function (options) {
    BaseMailProvider.apply(this, arguments);
    this.model = options.model;
    this.contentField = options.contentField;
};

DBProvider.prototype = Object.create(BaseMailProvider.prototype);
DBProvider.prototype.constructor = DBProvider;

DBProvider.prototype.getContent = function (templateName, params) {
    var deferred = Q.defer();
    var self = this;
    var query = {
        key: templateName,
        'auditing.deleted': false
    };

    self.model.findOne(query).exec(function (err, templateObj) {
        if (!templateObj) {
            return deferred.reject(new Error('Email template not found'));
        }

        var template = Handlebars.compile(templateObj[self.contentField]);

        return deferred.resolve(template(params));

    });

    return deferred.promise;
};