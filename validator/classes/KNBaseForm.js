/**
 * Created by Vadim on 11/20/15.
 */
'use strict';
var Q = require('q');
var fs = require('fs');
var KNUtils = require('./KNUtils');
var KNValidationException = require('../../exceptions/exceptions/KNValidationException');
var KNRuleException = require('../exceptions/KNRuleException');

/**
 *
 * @param {express.Request} req
 * @constructor
 */
function KNBaseForm(params, scenerio) {
    this.params = params;
    this.scenerio = scenerio || 'insert';
    this.errors = [];
    this._result = null;
}

function _resolveRuleMethod($this, name) {
    var deferred = Q.defer();
    if (name.indexOf('Rule') > -1) {
        if ($this[name] === undefined) {
            return Q.resolve(new Error('Validation method not found: ' + name));
        }

        return Q.resolve($this[name]);
    } else {
        fs.exists(__dirname + '/rules/' + name + 'Rule.js', function (exists) {
            if (!exists) {
                return deferred.resolve(new Error('Validation method not found: ' + name));
            }

            var Rule = require(__dirname + '/rules/' + name + 'Rule');
            deferred.resolve(Rule.validate);
        });
    }
    return deferred.promise;
}

function _execScenerio($this, scenario, params) {
    var deferred = Q.defer();

    if (!scenario.rule) {
        return Q.resolve(null);
    }

    if (scenario.fields.length === 0) {
        return Q.resolve(null);
    }

    _resolveRuleMethod($this, scenario.rule).then(function (method) {
        if (method instanceof Error) {
            console.error(method);
            return deferred.resolve([]);
        }

        var funcs = [];
        scenario.fields.forEach(function (field) {
            var value = KNUtils.findValue(params, field);
            funcs.push(method.call($this, field, scenario.params, params, value));
        });

        Q.allSettled(funcs).then(function (result) {
            var errors = [];
            for (var i in result) {
                var res = result[i];
                if (res.state == 'rejected') {
                    errors.push(res.reason);
                    continue;
                }
                if (res.state == 'fulfilled' && res.value instanceof KNRuleException) {
                    errors.push(res.value);
                    continue;
                }
            }
            deferred.resolve(errors);
        });
    });
    return deferred.promise;
}

KNBaseForm.prototype.setResult = function (result) {
    this._result = result;
};

KNBaseForm.prototype.validate = function () {
    var deferred = Q.defer();
    var $this = this;
    var rules = [];
    if ($this.rules().default !== undefined) {
        rules.push($this.rules().default);
    }
    if ($this.rules()[$this.scenerio] !== undefined && $this.rules()[$this.scenerio].length > 0) {
        rules.push($this.rules()[$this.scenerio]);
    }
    if (rules.length === 0) {
        return Q.resolve();
    }

    var funcs = [];
    rules.forEach(function (scenarios) {
        for (var i in scenarios) {
            funcs.push(_execScenerio($this, scenarios[i], $this.params));
        }
    });
    Q.all(funcs).then(function (scenarios) {
        var obj = {};
        for (var i in scenarios) {
            var scenario = scenarios[i];

            for (var j in scenario) {
                var error = scenario[j];

                if (obj[error.field]) {
                    continue;
                }

                if (error instanceof KNValidationException) {
                    obj[error.field] = {
                        field: error.field,
                        errors: error.getErrors()
                    };
                } else {
                    obj[error.field] = {
                        field: error.field,
                        code: error.code,
                        message: error.message
                    };
                }
            }
        }

        var errors = [];
        for (var k in obj) {
            errors.push(obj[k]);
        }
        if (errors.length > 0) {
            return deferred.reject(new KNValidationException(errors));
        }
        deferred.resolve(this._result);
    }.bind(this));
    return deferred.promise;
};

// export the class
module.exports = KNBaseForm;