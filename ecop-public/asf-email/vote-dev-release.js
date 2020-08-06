/**
 * Usage:
 * node vote-dev-release.js 4.1.0.rc3 asfqwe12343
 */

const fs = require('fs');
const pathTool = require('path');

const baseDir = __dirname;

const ecReleaseVersion = process.argv[2];
const ecReleaseCommit = process.argv[3];
const ecReleaseVersionFullName = process.argv[4];

if (!ecReleaseVersion) {
    throw new Error('ec release version is required!');
}
if (!ecReleaseCommit) {
    throw new Error('ec commit version is required!');
}

console.log('--------------------------');
console.log('[Release Verion] ' + ecReleaseVersion);
console.log('[Release Commit] ' + ecReleaseCommit);

let tpl = fs.readFileSync(pathTool.join(baseDir, './tpl/vote-dev-release.tpl'), {encoding:'utf-8'});
let voteUntil = new Date(+new Date() + 73 * 3600 * 1000);

tpl = tpl
    .replace(/{{ECHARTS_RELEASE_VERSION}}/g, ecReleaseVersion)
    .replace(/{{ECHARTS_RELEASE_VERSION_FULL_NAME}}/g, ecReleaseVersionFullName)
    .replace(/{{ECHARTS_RELEASE_COMMIT}}/g, ecReleaseCommit)
    .replace(/{{VOTE_UNTIL}}/g, voteUntil.toISOString());

console.log('--------------------------');

console.log(tpl);

console.log('--------------------------');
