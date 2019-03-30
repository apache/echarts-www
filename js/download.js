$.getJSON("https://api.github.com/repos/apache/incubator-echarts/releases").done(function (param) {
    var table = document.getElementById('download-table');
    for (var i = 0; i < param.length; ++i) {
        if (!param[i].prerelease) {
            var time = new Date(param[i].published_at);
            if (time.getTime() > new Date('2018-05-21')) {
                var line = document.createElement('tr');

                var version = param[i].name;
                var versionEl = document.createElement('td');
                versionEl.innerHTML = param[i].name;
                line.appendChild(versionEl);

                var date = document.createElement('td');
                date.innerHTML = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate();
                line.appendChild(date);

                var main = 'https://www.apache.org/dist/incubator/echarts/' + version
                    + '/apache-echarts-' + version + '-incubating';
                var mirror = 'https://www.apache.org/dyn/closer.cgi/incubator/echarts/' + version
                    + '/apache-echarts-' + version + '-incubating';

                var source = document.createElement('td');
                source.innerHTML = '<a target="_blank" href="' + mirror + '-src.zip">Source</a> '
                    + '(<a target="_blank" href="' + main + '-src.zip.asc">Signature</a> '
                    + '<a target="_blank" href="' + main + '-src.zip.sha512">SHA512</a>)';
                line.appendChild(source);

                var bin = document.createElement('td');
                bin.innerHTML = '<a target="_blank" href="https://github.com/apache/incubator-echarts/releases/tag/'
                    + version + '">GitHub v' + version + '</a>';
                line.appendChild(bin);

                table.appendChild(line);
            }
        }
    }
});
