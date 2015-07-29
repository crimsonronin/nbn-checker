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
        zlib.gunzip(body, function(err, dezipped) {
          var xmlString = dezipped.toString('utf-8');
          xml2js.parseString(xmlString, function(err, xmlObj) {
            deferred.resolve(xmlObj);
          });
        });
      }
    });

  return deferred.promise;
};

module.exports = exports = new RobotsParser();
