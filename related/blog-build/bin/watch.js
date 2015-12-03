/**
 * @usage
 * bin/watch.js someBlogName
 */

var path = require('path');
var fs = require('fs');
var build = require('./build');

var opts = {
    blogName: process.argv[2],
    blogPath: path.join(__dirname, '../../blog')
};

if (!opts.blogName) {
    console.log('no blog name');
    return;
}

var markdownPath = path.join(opts.blogPath, opts.blogName, opts.blogName + '.md');

if (!fs.existsSync(markdownPath) || !fs.statSync(markdownPath).isFile()) {
    console.error(markdownPath + ' must be a md file');
    return;
}

fs.watch(markdownPath, function (event) {
    if (event === 'change') {
        console.log(markdownPath + ' changed, auto compile ...');
        setTimeout(function () {
            build.start(); // Writing may be not finished yet.
        }, 1000);
    }
});
