const path = require('path');
const config = require('./common');

config.host = 'http://localhost/echarts-website';
// config.host = 'http://localhost:8000/echarts/echarts-website';

config.cdnPayRootMap = {
    zh: config.host,
    en: 'http://localhost/echarts-website'
};
config.cdnFreeRootMap = {
    zh: config.host,
    en: config.host
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
