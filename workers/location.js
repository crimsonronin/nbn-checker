var _ = require('lodash');
var q = require('q');
var robotsParser = require('../parsers/robots');

function LocationsWorker() {

}

/**
 * Parses a robots.txt of a location.
 *
 * @param location
 * @returns {*|!ScraperPromise}
 */
LocationsWorker.prototype.get = function(location) {
    return robotsParser.parse(location).
        then(function(xml) {
            return q.fcall(function() {
                return xml.urlset.url;
            });
        });
};

module.exports = exports = new LocationsWorker();
