/**
 * Usage:
 * node vote-general-release.js 4.1.0.rc3 asfqwe12343
 */

const fs = require('fs');
const pathTool = require('path');

const baseDir = __dirname;

const ecReleaseVersion = process.argv[2];
const ecReleaseCommit = process.argv[3];
const voteThread = process.argv[4];
const voteResultThread = process.argv[5];
const ecReleaseVersionFullName = process.argv[6];

if (!ecReleaseVersion) {
    throw new Error('ec release version is required!');
}
if (!ecReleaseCommit) {
    throw new Error('ec commit version is required!');
}
if (!voteThread) {
    throw new Error('vote thread is required!');
}
if (!voteResultThread) {
    throw new Error('vote result thread is required!');
}

console.log('--------------------------');
console.log('[Release Verion] ' + ecReleaseVersion);
console.log('[Release Commit] ' + ecReleaseCommit);
console.log('[Vote Thread] ' + voteThread);
console.log('[Vote Result Thread] ' + voteResultThread);

let tpl = fs.readFileSync(pathTool.join(baseDir, './tpl/vote-general-release.tpl'), {encoding:'utf-8'});
let voteUntil = new Date(+new Date() + 73 * 3600 * 1000);

tpl = tpl
    .replace(/{{ECHARTS_RELEASE_VERSION}}/g, ecReleaseVersion)
    .replace(/{{ECHARTS_RELEASE_VERSION_FULL_NAME}}/g, ecReleaseVersionFullName)
    .replace(/{{ECHARTS_RELEASE_COMMIT}}/g, ecReleaseCommit)
    .replace(/{{VOTE_THREAD}}/g, voteThread)
    .replace(/{{VOTE_RESULT_THREAD}}/g, voteResultThread)
    .replace(/{{VOTE_UNTIL}}/g, voteUntil.toISOString());

console.log('--------------------------');

console.log(tpl);

console.log('--------------------------');
