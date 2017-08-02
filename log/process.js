var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var querystring = require('querystring');

var instream  = fs.createReadStream('./statistics.log');
var outstream = new stream.Writable();
var rl = readline.createInterface(instream, outstream);

var optionViewCountFlat = {};

var downloadCount = {
    'echarts.min.js': 0,
    'echarts.simple.min.js': 0,
    'echarts.common.min.js': 0,
    'echarts.js': 0
};
var builderCount = {
    all: 0,
    charts: {},
    components: {},
    ie: 0
};
var themeDownloadCount = {};

var processedLinesCount = 0;
var processedLinesCount100k = 0;

var urlMatch = /\"GET (.*?)\"/;
rl.on('line', function (line) {
    if (!line) {
        return;
    }
    processedLinesCount++;
    if (processedLinesCount === 1e5) {
        processedLinesCount100k++;
        console.log('Processed ' + 1e5 * processedLinesCount100k + ' lines');
        processedLinesCount = 0;
    }

    // var items = line.split(' ');
    // var ip = items[0];
    // var time = items[2];
    // var url = items[3];
    var res = urlMatch.exec(line);
    if (!res || !res[1]) {
        return;
    }
    var url = res[1];
    var query = url.split('?')[1];
    if (!query) {
        return;
    }
    var paramsMap = querystring.parse(query);

    if (paramsMap.page === 'option' && paramsMap.key === 'clickTreeItem') {
        optionViewCountFlat[paramsMap.data] = optionViewCountFlat[paramsMap.data] || 0;
        optionViewCountFlat[paramsMap.data]++;
    }
    if (paramsMap.page === 'download') {
        if (paramsMap.file !== 'undefined') {
            downloadCount[paramsMap.file] = downloadCount[paramsMap.file] || 0;
            downloadCount[paramsMap.file]++;
        }
    }
    if (paramsMap.page === 'download-theme') {
        if (paramsMap.file !== 'undefined') {
            themeDownloadCount[paramsMap.file] = themeDownloadCount[paramsMap.file] || 0;
            themeDownloadCount[paramsMap.file]++;
        }
    }
    if (paramsMap.page === 'builder') {
        var buildParameters = querystring.parse(
            querystring.unescape(paramsMap['build-parameters-3'])
        );
        var charts = buildParameters.charts.split(',');
        var components = buildParameters.components.split(',');
        for (var i = 0; i < charts.length; i++) {
            if (charts[i]) {
                builderCount.charts[charts[i]] = builderCount.charts[charts[i]] || 0;
                builderCount.charts[charts[i]]++;
            }
        }
        for (var i = 0; i < components.length; i++) {
            if (components[i]) {
                builderCount.components[components[i]] = builderCount.components[components[i]] || 0;
                builderCount.components[components[i]]++;
            }
        }
        if (buildParameters.vml) {
            builderCount.ie++;
        }
        builderCount.all++;
    }
});

rl.on('close', function () {
    var optionViewCount = {};
    var optionKeywordsCount = {};
    // console.log(optionViewCountFlat);
    for (var path in optionViewCountFlat) {
        if (path === 'undefined') {
            continue;
        }
        var count = optionViewCountFlat[path];
        // Some doc error
        if (path.indexOf('%') >= 0) {
            path = path.substr(0, path.indexOf('%'));
        }
        // For threemap
        var items = path.replace('-', '.').split('.');
        var obj = items.reduce(function (obj, item) {
            obj[item] = obj[item] || {};
            return obj[item];
        }, optionViewCount);
        obj.$count = obj.$count || 0;
        obj.$count += count;

        // For wordcloud
        items.forEach(function (kw) {
            optionKeywordsCount[kw] = optionKeywordsCount[kw] || 0;
            optionKeywordsCount[kw] += count;
        });
    }
    fs.writeFileSync('./out/option-view.json', JSON.stringify(optionViewCount, null, 2), 'utf-8');

    fs.writeFileSync('./out/option-kw.json', JSON.stringify(optionKeywordsCount, null, 2), 'utf-8');

    fs.writeFileSync('./out/download.json', JSON.stringify(downloadCount, null, 2), 'utf-8');

    fs.writeFileSync('./out/builder.json', JSON.stringify(builderCount, null, 2), 'utf-8');

    fs.writeFileSync('./out/download-theme.json', JSON.stringify(themeDownloadCount, null, 2), 'utf-8');
});