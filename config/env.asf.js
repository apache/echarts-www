const path = require('path');
const config = require('./common');

config.host = 'https://echarts.apache.org/v4';

config.cdnPayRootMap = {
    // Expensive!!! use it carefully.
    // zh: 'https://echarts-www.cdn.bcebos.com', // origin: 'https://echarts-www.bj.bcebos.com'
    zh: 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/v4',
    en: 'https://echarts.apache.org/v4'
};
config.cdnFreeRootMap = {
    // 'echarts.cdn.apache.org' have been configured for zh (?)
    // zh: 'https://echarts.cdn.apache.org',
    zh: 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/v4',
    en: 'https://echarts.apache.org/v4'
};
config.releaseDestDir = path.resolve(__dirname, '../../../echarts-website/v4');

module.exports = config;
