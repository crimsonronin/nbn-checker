var request = require('request');
var xml2js = require('xml2js');
var zlib = require('zlib');
var q = require('q');

function RobotsParser() {

}

/**
 * Parses a robots.txt url
 */
RobotsParser.prototype.parse = function(url) {
  var deferred = q.defer();

  request.get({
      url: url,
      headers: {
        'Accept-Encoding': 'gzip, deflate',
      },
      encoding: null
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        parseResponse(body).
        then(function(entries) {
          deferred.resolve(entries);
        })
      }
    });

  return deferred.promise;
};

/**
 * Parses a robots.txt.gz and returns an object view.
 */
function parseResponse(body) {
  return q.ninvoke(zlib, 'gunzip', body).
  then(function(dezipped) {
    return q.ninvoke(xml2js, 'parseString', dezipped.toString('utf-8'));
  }).
  then(function(robots) {
    if (!!robots.sitemapindex && !!robots.sitemapindex.sitemap) {
      return q.fcall(function() {
        return robots.sitemapindex.sitemap;
      });
    } else {
      return false;
    }
  });
}

module.exports = exports = new RobotsParser();
