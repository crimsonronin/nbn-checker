var _ = require('lodash');
var moment = require('moment');
var robotsParser = require('../parsers/robots');

var REAL_ESTATE_ROBOTS =
  'http://www.realestate.com.au/xml-sitemap/sitemap.xml.gz';

var SITEMAP_BUY_DATE = "sitemap_details_buy_";
var SITEMAP_RENT_DATE = "sitemap_details_rent_";
var SITEMAP_BUY_ALL = "sitemap_results_buy_list_all";
var SITEMAP_BUY_INSPECTION_TIMES_ALL =
  "sitemap_results_buy_inspection-times_all";
var SITEMAP_BUY_AUCTION_TIMES_ALL = "sitemap_results_buy_auction-times_all";
var SITEMAP_RENT_ALL = "sitemap_results_rent_list_all";
var SITEMAP_RENT_INSPECTION_TIMES_ALL =
  "sitemap_results_rent_inspection-times_all";

function SitemapWorker() {

}

/**
 * Parses a robots.txt url
 */
SitemapWorker.prototype.run = function() {
  robotsParser.parse(REAL_ESTATE_ROBOTS).
  then(function(entries) {
    var today = moment();

    _.forEach(entries, function(entry) {
      var lastModified = entry.lastmod[0];

      if (today.startOf('day').isSame(moment(lastModified).startOf(
          'day'))) {
        _.forEach(entry.loc, function(location) {
          console.log(location);
        });
      }
    });
  });
};

module.exports = exports = new SitemapWorker();
