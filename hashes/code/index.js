/**
 * Created by petervandeput on 15/10/2015.
 */
'use strict';

var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
var base = alphabet.length;

exports.encode = function (i) {
    var s;
    if (i === 0) {
        return alphabet[0];
    }
    s = '';
    while (i > 0) {
        s += alphabet[i % base];
        i = parseInt(i / base, 10);
    }
    return s.split('').reverse().join('');
};

exports.decode = function (s) {
    var c, i, _i, _len;
    i = 0;
    for (_i = 0, _len = s.length; _i < _len; _i = i + 1) {
        c = s[_i];
        i = i * base + alphabet.indexOf(c);
    }
    return i;
};

/* unit test, 1 billion links were checked
 for (i = _i = 0; _i <= 1000000000; i = ++_i) {
 if (exports.decode(exports.encode(i)) !== i) {
 console.log(exports.encode(i), i, "is not", exports.decode(exports.encode(i)));
 console.log("error");
 break;
 }
 }
 console.log("done");
 */