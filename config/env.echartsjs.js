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
