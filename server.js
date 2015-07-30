var _ = require('lodash');
var moment = require('moment');
var sitemapWorker = require('./workers/sitemap');

sitemapWorker.run();
