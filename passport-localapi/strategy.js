// jshint ignore: start
/**
 * Created by Vadim on 31.07.2014.
 */
'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    util = require('util'),
    BadRequestError = require('./badRequestError');

function Strategy(options, verify) {
    if (typeof options == 'function') {
        verify = options;
        options = {};
    }
    if (!verify) throw new Error('local authentication strategy requires a verify function');

    this._apiKeyField = options.apiKeyField || 'access_token';
    this._apiKeyHeader = options.apiKeyHeader || 'access_token';

    passport.Strategy.call(this);
    this.name = options.name || 'localapi';
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function (req, options) {
    options = options || {};
    var apikey = lookup(req.body, this._apiKeyField) || lookup(req.query, this._apiKeyField) || lookup(req.headers, this._apiKeyHeader);

    if (!apikey) {
        return this.fail(new BadRequestError(options.badRequestMessage || 'Missing token'));
    }

    var self = this;

    function verified(err, user, info) {
        if (err) {
            return self.error(err);
        }
        if (!user) {
            return self.fail(info);
        }
        self.success(user, info);
    }

    if (self._passReqToCallback) {
        this._verify(req, apikey, verified);
    } else {
        this._verify(apikey, verified);
    }

    function lookup(obj, field) {
        if (!obj) {
            return null;
        }
        var chain = field.split(']').join('').split('[');
        for (var i = 0, len = chain.length; i < len; i++) {
            var prop = obj[chain[i]];
            if (typeof(prop) === 'undefined') {
                return null;
            }
            if (typeof(prop) !== 'object') {
                return prop;
            }
            obj = prop;
        }
        return null;
    };
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;