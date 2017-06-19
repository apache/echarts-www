var parseGpx = require('gpx-parse');
var baiduMap = require('baidumap');
var fs = require('fs');
var glob = require('glob');

var json = {};

var bmap = baiduMap.create({
    'ak': 'FFc930c7bb3fd0eb4df8a976ff36ff09'
});

function convertPoints(points) {
    return new Promise(function (resolve, reject) {
        bmap.geoconv({
            coords: points.map(function (pt) {
                return pt.join(',');
            }).join(';')
        }, function (err, result) {
            resolve(result);
        });
    });
}

glob('hangzhou_hiking/*.gpx', function (err, files) {
    Promise.all(files.map(function (file) {
        return getGpxPoints(file);
    })).then(function (tracks) {
        fs.writeFileSync('hangzhou-tracks.json', JSON.stringify(tracks), 'utf-8');
    });
});

function getGpxPoints(fileName) {
    return new Promise(function (resolve, reject) {
        parseGpx.parseGpxFromFile(fileName, function (error, res) {
            var points = res.tracks[0].segments[0].map(function (seg) {
                return [seg.lon, seg.lat];
            });
            var promises = [];
            for (var i = 0; i < points.length; i+=100) {
                promises.push(convertPoints(points.slice(i, i + 100)));
            }

            // Assume waypoints has less number than 100
            promises.unshift(convertPoints(res.waypoints.map(function (wp) {
                return [wp.lon, wp.lat];
            })));

            Promise.all(promises).then(function (results) {
                json.track = [].concat.apply([], results.slice(1).map(function (item) {
                    item = JSON.parse(item);
                    if (item.status !== 0) {
                        throw new Error(item.status);
                    }
                    return item.result.map(function (coord) {
                        return [coord.x, coord.y];
                    });
                })).map(function (pt, idx) {
                    return {
                        coord: pt,
                        elevation: res.tracks[0].segments[0][idx].elevation
                    };
                });

                resolve(json.track);
                // fs.writeFileSync('xihu-track.json', JSON.stringify(json), 'utf-8');
            }, function (error) {
                console.log(error);
            }).catch(function (error) {
                console.error(error);
            });
        });
    });
}