/**
 * Created by Vadim on 11/20/15.
 */
'use strict';

exports.findValue = function (obj, path) {
    var paths = path.split('.');
    var current = obj;

    for (var i = 0; i < paths.length; i++) {
        if (current[paths[i]] === undefined) {
            return undefined;
        } else {
            current = current[paths[i]];
        }
    }
    return current;
};