const path = require('path');
const config = require('./common');

config.host = 'https://echarts.apache.org';

config.cdnPayRootMap = {
    // Expensive!!! use it carefully.
    // zh: 'https://echarts-www.cdn.bcebos.com', // origin: 'https://echarts-www.bj.bcebos.com'
    // zh: 'https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site',
    zh: 'https://echarts.apache.org',
    en: 'https://echarts.apache.org'
};
config.cdnFreeRootMap = {
    // 'echarts.cdn.apache.org' have been configured for zh (?)
    // zh: 'https://echarts.cdn.apache.org',
    // zh: 'https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site',
    zh: 'https://echarts.apache.org',
    en: 'https://echarts.apache.org'
};
config.galleryPath = 'https://echarts.apache.org/examples/';
config.releaseDestDir = path.resolve(__dirname, '../../echarts-website');

// TODO put this in common.js
function addHostToThirdPartyLinks(links, lang, host) {
    const newLinks = {};
    for (let key in links) {
        newLinks[key] = `${host}/${lang}/${links[key]}`;
    }
    return newLinks;
}
config.cdnThirdPartyCN = addHostToThirdPartyLinks(config.cdnThirdPartyCN, 'zh', config.host);
config.cdnThirdParty = addHostToThirdPartyLinks(config.cdnThirdParty, 'en', config.host);

module.exports = config;
