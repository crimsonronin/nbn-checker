var express = require('express');
var addressScraper = require('./rea-address-scraper.js');
var nbnScraper = require('./nbn-scraper.js');
var app = express();
var PORT = 8000;

app.get('/', function(req, res) {
  var url = req.query.url;
  var result = {
    address: false,
    nbn: false
  };

  if (!url) {
    res.sendStatus(400, 'Please include the url you wish to check');
    return;
  } else {
    addressScraper.get(url).
    then(function(address) {
      result.address = address;
      return nbnScraper.get(address);
    }).
    then(function(nbn) {
      if (nbn.active) {
        result.nbn = 'The NBN is active now!';
      } else if (nbn.comingSoon) {
        result.nbn = 'The NBN is coming soon';
      } else if (nbn.startedBuild) {
        result.nbn = 'The NBN build has started';
      } else {
        result.nbn =
          'There\'s no NBN at this address. Screw you Tony Abbott and Malcolm Turnbull!';
      }
      res.json(result);
    }).
    fail(function(err) {
      res.status(404).send(err);
    })
  }
});

app.listen(PORT, function() {
  console.log('Example app listening at %s', PORT);
});
