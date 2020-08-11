/**
 * Usage:
 * node announce-release.js 4.3.0
 */

const fs = require('fs');
const pathTool = require('path');

const baseDir = __dirname;

const ecReleaseVersion = process.argv[2];

if (!ecReleaseVersion) {
    throw new Error('ec release version is required!');
}

console.log('--------------------------');
console.log('[Release Verion] ' + ecReleaseVersion);

let tpl = fs.readFileSync(pathTool.join(baseDir, './tpl/announce-release.tpl'), {encoding:'utf-8'});

tpl = tpl
    .replace(/{{ECHARTS_RELEASE_VERSION}}/g, ecReleaseVersion);

console.log('--------------------------');

console.log(tpl);

console.log('--------------------------');
