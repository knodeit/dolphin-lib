/**
 * Created by petervandeput on 16/10/2015.
 */
'use strict';

var Q = require('q');


function Geocoder(apiKey) {
    var geocoderProvider = 'google';
    var httpAdapter = 'https';
    var extra = {
        apiKey: apiKey
    };
    this.service = require('node-geocoder')(geocoderProvider, httpAdapter, extra);
}

Geocoder.prototype.reverseGeocode = function (latitude, longitude) {
    var deferred = Q.defer();
    this.service.reverse({lat:latitude, lon:longitude})
        .then(function(result) {
            return deferred.resolve(result);
        })
        .catch(function(err) {
            return deferred.reject(err);
        });
    return deferred.promise;
};

Geocoder.prototype.geocode = function (address) {
    var deferred = Q.defer();
    this.service.geocode(address)
        .then(function(result) {
            return deferred.resolve(result);
        })
        .catch(function(err) {
            return deferred.reject(err);
        });
    return deferred.promise;
};


// export the class
module.exports = Geocoder;