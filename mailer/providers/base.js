'use strict';

/**
 * Constructor
 *
 * @type {Function}
 */
var BaseMailProvider = module.exports = function (options) {
    this.options = options;
};

/**
 * Render template and get content
 *
 * @param templateName
 * @param params
 */
BaseMailProvider.prototype.getContent = function (templateName, params) {
    //do nothing
};