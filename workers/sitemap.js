var _ = require('lodash');
var q = require('q');
var robotsParser = require('../parsers/robots');

var REAL_ESTATE_ROBOTS =
    'http://www.realestate.com.au/xml-sitemap/sitemap.xml.gz';

var SITEMAP_FOR_SALE_DETAILS = "sitemap_details_buy_";
var SITEMAP_FOR_RENT_DETAILS = "sitemap_details_rent_";
var SITEMAP_FOR_SALE_ALL = "sitemap_results_buy_list_all";
var SITEMAP_FOR_SALE_INSPECTION_TIMES_ALL =
    "sitemap_results_buy_inspection-times_all";
var SITEMAP_FOR_SALE_AUCTION_TIMES_ALL = "sitemap_results_buy_auction-times_all";
var SITEMAP_FOR_RENT_ALL = "sitemap_results_rent_list_all";
var SITEMAP_FOR_RENT_INSPECTION_TIMES_ALL =
    "sitemap_results_rent_inspection-times_all";

function SitemapWorker() {

}

SitemapWorker.prototype.getForSaleByState = function(state) {
    return this.get([SITEMAP_FOR_SALE_DETAILS + state]);
};

SitemapWorker.prototype.getForSale = function() {
    return this.get([SITEMAP_FOR_SALE_DETAILS]);
};

SitemapWorker.prototype.getAllForSale = function() {
    return this.get([SITEMAP_FOR_SALE_ALL]);
};

SitemapWorker.prototype.getAll = function() {
    return this.get();
};

/**
 * Parses a robots.txt url given the filters
 *
 * @param filters
 * @returns {*|!ScraperPromise}
 */
SitemapWorker.prototype.get = function(filters) {
    var results = [];

    return robotsParser.parse(REAL_ESTATE_ROBOTS).
        then(function(xml) {
            _.each(xml.sitemapindex.sitemap, function(entry) {
                _.forEach(entry.loc, function(location) {
                    if (!!filters) {
                        if (inFilter(location, filters)) {
                            results.push(location);
                        }
                    } else {
                        results.push(location);
                    }
                });
            });

            return q.fcall(function() {
                return results;
            });
        });
};

/**
 * Checks if the location is in the current filters.
 *
 * @param location
 * @param filters
 * @returns {boolean}
 */
function inFilter(location, filters) {
    var inFilter = false;

    _.each(filters, function(filter) {
        if (location.indexOf(filter) > -1) {
            inFilter = true;
            return;
        }
    });

    return inFilter;
}

module.exports = exports = new SitemapWorker();
