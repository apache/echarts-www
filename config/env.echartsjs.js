const path = require('path');
const config = require('./common');

config.host = 'https://www.echartsjs.com';
config.cdnPayRootMap = {
    zh: config.host,
    en: config.host
};
config.cdnFreeRootMap = {
    zh: config.host,
    en: config.host
};
config.galleryPath = 'https://www.echartsjs.com/gallery/';
config.blogPath = 'https://efe.baidu.com/tags/ECharts/';
config.releaseDestDir = path.resolve(__dirname, '../release');

module.exports = config;
