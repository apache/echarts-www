/**
 * @usage
 * bin/watch.js someBlogName
 */

var path = require('path');
var fs = require('fs');
var marked = require('marked');

var opts = {
    blogName: process.argv[2],
    blogPath: path.join(__dirname, '../../blog'),
    resourcePath: path.join(__dirname, '..', 'resource'),
    theme: 'github'
};

if (!opts.blogName) {
    console.log('no blog name');
    return;
}

start();

function start() {

    console.log('parsing ...');
    var html = render();
    console.log('done.');

    console.log('saving ...');
    output(html);
    console.log('done.');
}

function render() {

    var markdownPath = path.join(opts.blogPath, opts.blogName, opts.blogName + '.md');

    if (fs.existsSync(markdownPath)) {
        var raw = fs.readFileSync(markdownPath).toString();

        var content = marked(raw);
        // console.log(content);

        var template = fs.readFileSync(
            path.join(opts.resourcePath, 'blog.html')
        ).toString();

        return template
            .replace('{{{theme}}}', opts.theme)
            .replace('{{{content}}}', content);
    }
    else {
        console.log(markdownPath + ' not exists');
    }
}

function output(html) {
    var htmlPath = path.join(opts.blogPath, opts.blogName, opts.blogName + '.html');
    fs.writeFileSync(htmlPath, html, {encoding:'utf-8'});

    var assetDirPath = path.join(opts.blogPath, opts.blogName, 'asset');

    // If no old version exists, do nothing,
    // otherwise, copy lib.
    // It is not necessary to do copy every time,
    // which I think is not good for my SSD disk,
    // especially when using 'watch'.
    if (!fs.existsSync(assetDirPath)) {
        fs.mkdirSync(assetDirPath);
    }

    copy('md-theme-' + opts.theme + '.css', assetDirPath);
    copy('jquery.min.js', assetDirPath);
    copy('md-env.js', assetDirPath);
    copy('lazysizes.min.js', assetDirPath);
}

function copy(name, assetDirPath) {
    var file = fs.readFileSync(
        path.join(opts.resourcePath, name)
    ).toString();

    fs.writeFileSync(
        path.join(assetDirPath, name),
        file,
        {encoding:'utf-8'}
    );
}

module.exports = {
    start: start
};
