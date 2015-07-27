/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var _ = require('lodash');
var scraperjs = require('scraperjs');
var REA_ENDPOINT = "http://realestate.com.au/";

/**
 * An address scraper for realestate.com.au
 *
 * @constructor
 */
function ReaAddressScraper() {
  this.endpoint = REA_ENDPOINT;
}

ReaAddressScraper.prototype.get = function(url) {
  var deferred = q.defer();

  scraperjs.DynamicScraper.
  create(this.endpoint + decodeURIComponent(url)).
  onStatusCode(404, function() {
    deferred.reject('Address not found');
  }).
  scrape(function() {
    var address = {
      street: "",
      suburb: "",
      state: "",
      postcode: ""
    };

    $('h1[itemprop="address"]').
    filter(function() {
      var data = $(this);
      address.street = data.find('span[itemprop="streetAddress"]').text();
      address.suburb = data.find('span[itemprop="addressLocality"]')
        .text();
      address.state = data.find('span[itemprop="addressRegion"]').text();
      address.postcode = data.find('span[itemprop="postalCode"]').text();
    });

    return address;
  }, function(address) {
    if (address.postcode === '') {
      deferred.reject('Address not found');
    } else {
      deferred.resolve(address);
    }
  });

  return deferred.promise;
};

module.exports = exports = new ReaAddressScraper();
