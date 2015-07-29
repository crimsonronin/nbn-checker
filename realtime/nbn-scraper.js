/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var Nightmare = require('nightmare');

var PORT = 8000;
var NBNCO_SEARCH_ENDPOINT =
  'http://www.nbnco.com.au/connect-home-or-business/check-your-address.html';
var NBNCO_RESULT_ENDPOINT =
  'http://www.nbnco.com.au/connect-home-or-business/check-your-address/rfs-dd18-fl-home.html';
var SEARCH_INPUT = '#map-lookup-input';
var SEARCH_BUTTON = '#map-lookup-button-home';
var RESULT_COPY = '.richtext h1';
var NBN_ACTIVE_TEXT = 'great news';
var NBN_COMING_SOON_TEXT = 'network is coming to your address';
var NBN_STARTED_TEXT = 'groundworks are underway';

/**
 * An address scraper for nbnco.com.au
 *
 * @constructor
 */
function NbnScraper() {
  this.nightmare = new Nightmare().
  on('timeout', function(message) {
    console.log('TIMEOUT');
  });
}

NbnScraper.prototype.get = function(address) {
  var deferred = q.defer();
  var nbn = {};

  this.nightmare.goto(NBNCO_SEARCH_ENDPOINT)
    .type(SEARCH_INPUT, formatAddress(address))
    .click(SEARCH_BUTTON)
    .wait('.result-prompt-copy')
    .evaluate(getNbnStatus,
      function(results) {
        nbn = results;
        return results;
      })
    .run(function(err, ntm) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(nbn);
      }
    });

  return deferred.promise;
}

function formatAddress(address) {
  return [
    address.street,
    address.suburb,
    address.state,
    address.postcode
  ].join(', ');
}

function getNbnStatus() {
  var nbn = {
    active: false,
    comingSoon: false,
    startedBuild: false,
    message: null
  };

  var results = document.querySelector('.richtext h1');
  if (!!results) {
    var text = document.querySelector('.richtext h1').innerText.toLowerCase();

    if (text.indexOf('great news') > -1) {
      nbn.active = true;
    } else if (text.indexOf('network is coming to your address') > -1) {
      nbn.comingSoon = true;
    } else if (text.indexOf('groundworks are underway') > -1) {
      nbn.startedBuild = true;
    }

    nbn.message = text;
  }

  return nbn;
}

module.exports = exports = new NbnScraper();
