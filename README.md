# dolphin-lib



# Validator

### Available rules

* boolean
* date (available parameters)
  1. format
* email
* length (available parameters)
  1. min
  2. max 
* match (available parameters)
  1. pattern
* number
* range (available parameters)
  1. min
  2. max
* required


## How to use 

Need to create form class and extend from base form:

```
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
                fields: ['a', 'b'],
                params:{} // for other rules
            }
        ],
        test: [
            {
                rule: 'number',
                fields: ['a', 'b']
            }
        ]
    };
};

module.exports = Form;
```

There are two scenarios, `default and test`. The default scenario always calls, by default scenario is **insert**. You can send a scenario to a form like the second parameter, the first parameter is our data.

```
var form = new From({a:1, b:2}, 'test'); //data and scenario
form.validate().then(function(){
   // success 
}).catch(function(err){
   //err will be as array of errors
});
```

Also you can dynamic extend your form:

```
Form.prototype.myRule = function (field, fieldParams, params, value) {
    if (value!==2) {
        return Q.resolve(new KNRuleException(field, 1111, 'Custom error message')); //field, error code and message
    }
    return Q.resolve();
};
```   
Always need to return a promise and to register your rule need to put this array to rules:
```
{
    rule: 'myRule',
    fields: ['b'],
    params:{} // it's the fieldParams
}
```

Also you can change message for each rule:
```
{
    rule: 'number',
    fields: ['b'],
    params:{
       message:'Test message'
    } // it's the fieldParams
}
```