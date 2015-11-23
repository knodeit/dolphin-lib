/**
 * Created by Vadim on 25.07.2014.
 */
'use strict';

exports.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
};