var _ = require('lodash');
var sitemapWorker = require('./workers/sitemap');
var locationWorker = require('./workers/location');

/**
 * Need to add queues and sleeps so it doesn't flood their servers.
 */
sitemapWorker.getForSaleByState('vic').
    then(function(locations) {
        _.each(locations, function(location) {
            locationWorker.get(location).
                then(function(property) {
                    console.log(property);
                });
        });
    });