var _ = require('lodash');
var q = require('q');
var request = require('request');
var cheerio = require('cheerio');

function PropertyWorker() {

}

/**
 * Parses a real estate url to grab the address and some other details.
 *
 * @param location
 * @returns {*|!ScraperPromise}
 */
PropertyWorker.prototype.get = function(url) {
    var deferred = q.defer();

    request.get({
            url: url
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                deferred.resolve(parseContent(body));
            }
        });

    return deferred.promise;
};

function parseContent(body) {
    var data = {};
    var address = {};

    $ = cheerio.load(body);

    address.street = getMeta($, 'street-address');
    address.suburb = getMeta($, 'locality');
    address.state = getMeta($, 'region');
    address.postcode = getMeta($, 'postal-code');
    data.address = address;

    data.url = getMeta($, 'url');
    data.image = getMeta($, 'image');

    return data;
}

function getMeta($, field) {
    return $('meta[property="og:' + field + '"]').attr('content');
}

module.exports = exports = new PropertyWorker();
