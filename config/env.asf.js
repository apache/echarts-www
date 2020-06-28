const path = require('path');
const config = require('./common');

config.host = 'https://echarts.apache.org';
// config.cdnRoot = 'https://echarts.cdn.apache.org';
config.cdnRootMap = {
    // zh: 'https://echarts-www.bj.bcebos.com',
    zh: 'https://echarts-www.cdn.bcebos.com',
    en: 'https://echarts.cdn.apache.org'
};
config.galleryPath = 'https://www.echartsjs.com/gallery/';
config.blogPath = 'https://efe.baidu.com/tags/ECharts/';
config.releaseDestDir = path.resolve(__dirname, '../../incubator-echarts-website');

module.exports = config;
