/**
 * Created by Vadim on 11/23/15.
 */
'use strict';

exports.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
};