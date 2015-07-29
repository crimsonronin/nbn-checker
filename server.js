var express = require('express');
var robotsParser = require('./parsers/robots');
var app = express();
var PORT = 8000;

app.get('/', function(req, res) {
  robotsParser.parse(
    'http://www.realestate.com.au/xml-sitemap/sitemap_details_buy_act_20150727.xml.gz'
  ).
  then(function(robots) {
    res.send(robots);
  });
});

app.listen(PORT, function() {
  console.log('Example app listening at %s', PORT);
});
