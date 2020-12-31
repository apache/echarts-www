const path = require('path');
const config = require('./common');

config.host = 'http://localhost/incubator-echarts-website';
// config.host = 'http://localhost:8000/echarts/incubator-echarts-website';
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
config.releaseDestDir = path.resolve(__dirname, '../../incubator-echarts-website');

module.exports = config;
