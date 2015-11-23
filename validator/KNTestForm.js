/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

var BaseForm = require('./classes/KNBaseForm');
var Q = require('q');

Form.prototype = new BaseForm();

// Constructor
function Form(params, scenerio) {
    // Call super constructor.
    BaseForm.apply(this, [params, scenerio]);
}

Form.prototype.rules = function () {
    return {
        default: [
            {
                rule: 'required',
                fields: ['a', 'b']
            }/*,
             {
             rule: 'number',
             fields: ['a', 'b']
             },
             {
             rule: 'length',
             fields: ['b'],
             params: {
             min: 15,
             max:16
             }
             },
             {
             rule: 'match',
             fields: ['b'],
             params: {
             pattern: /abC/i
             }
             },
             {
             rule: 'range',
             fields: ['b'],
             params: {
             min: 15,
             max: 16
             }
             },
             {
             rule: 'email',
             fields: ['b']
             },
            {
                rule: 'date',
                fields: ['b'],
                params: {
                    format: 'DD/MM/YYYY'
                }
            }*/
            ,
            {
                rule: 'boolean',
                fields: ['b']
            }
        ]
    };
};

module.exports = Form;