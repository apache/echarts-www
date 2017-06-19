define(function (require) {

    var mangleString = require('./mangleString');
    var replaceDefine = require('./replaceDefine');

    var etpl =require('./lib/etpl');
    var saveAs = require('./lib/FileSaver');

    var amdCode = require('text!./chunk/amd.js');
    var startWrapperCode = require('text!./chunk/start-3.js');
    var endWrapperCode = require('text!./chunk/end-3.js');

    var echartsPackageMainCode = 'define(\'echarts\', [\'echarts/echarts\'], function (echarts) { return echarts;});\n';
    var zrenderPackageMainCode = 'define(\'zrender\', [\'zrender/zrender\'], function (zrender) { return zrender;});\n';

    etpl.config({
        commandOpen: '/**',
        commandClose: '*/'
    });

    var $log = document.getElementById('log');

    function builderLog (msg) {
        $log.innerHTML += msg + '<br />';
        $log.scrollTop = $log.scrollHeight;
    }

    esl.onModuleLoad = function (moduleId) {
        // echarts/zrender module
        builderLog('Loaded module: "' + moduleId + '"');
    };

    function jsCompress(source) {
        var ast = UglifyJS.parse(source);
        /* jshint camelcase: false */
        // compressor needs figure_out_scope too
        ast.figure_out_scope();
        ast = ast.transform(UglifyJS.Compressor( {} ));

        // need to figure out scope again so mangler works optimally
        ast.figure_out_scope();
        ast.compute_char_frequency();
        ast.mangle_names();

        return ast.print_to_string();
    }

    // Including charts
    var charts = (BUILD_CONFIG.charts || '').split(',').filter(function (chart) {
        return chart;
    }).map(function (chart) {
        return 'echarts/chart/' + chart;
    });

    // Including components
    var components = (BUILD_CONFIG.components || '').split(',').filter(function (component) {
        return component;
    }).map(function (component) {
        return 'echarts/component/' + component;
    });

    if (charts.indexOf('echarts/chart/scatter') >= 0) {
        charts.push('echarts/chart/effectScatter');
    }

    var echartsDeps = ['echarts'].concat(charts).concat(components);

    if (BUILD_CONFIG.vml) {
        echartsDeps.push('zrender/vml/vml');
    }

    // Always require log and time axis
    echartsDeps.push('echarts/scale/Time', 'echarts/scale/Log');

    // Loading scripts and build
    require(echartsDeps, function () {
        var code = '';

        function depIdMapper(dep) {
            return '\'' + (dep.id || dep.absId) + '\'';
        }

        function convertModule(moduleInfo) {
            var factoryCode = replaceDefine(moduleInfo.factory.toString(), {
                __DEV__: !!BUILD_CONFIG.source
            });

            var deps = moduleInfo.depMs.map(depIdMapper);

            deps = moduleInfo.factoryDeps.map(depIdMapper).concat(deps);

            return ['define(\'', moduleInfo.id, '\', [', deps.join(', '), '], ', factoryCode, ');\n'].join('');
        }

        builderLog('<br />Assembling code...');

        for (var id in esl.modules) {
            var moduleInfo = esl.modules[id];
            // Not a echarts/zrender module
            if (!id.match(/^(echarts|zrender)/)) {
                continue;
            }

            code += convertModule(moduleInfo);
        }

        code += zrenderPackageMainCode;
        code += echartsPackageMainCode;

        if (!BUILD_CONFIG.amd) {
            endWrapperCode = etpl.compile(endWrapperCode)({
                charts: charts,
                components: components,
                vml: BUILD_CONFIG.vml
            });
            if (!BUILD_CONFIG.source) {
                code = mangleString(code);
            }
            code = startWrapperCode + amdCode + code + endWrapperCode;
        }


        if (!BUILD_CONFIG.source) {
            builderLog('<br />Compressing code...');
        }

        setTimeout(compressAndDownload);

        function compressAndDownload() {
            if (!BUILD_CONFIG.source) {
                code = jsCompress(code);
            }

            try {
                var blob = new Blob([code], {
                    type: 'text/plain;charset=utf8'
                });

                // var URL = window.URL || window.webkitURL;
                // var scriptUrl = URL.createObjectURL(blob);

                // URL.revokeObjectURL(blob);

                // window.open(scriptUrl);
                // return;

                var fileName = ['echarts'];
                if (BUILD_CONFIG.amd) {
                    fileName.push('amd');
                }
                if (!BUILD_CONFIG.source) {
                    fileName.push('min');
                }
                fileName.push('js');
                saveAs(blob, fileName.join('.'));
            }
            catch (e) {
                console.error(e);
                window.open('data:text/plain;charset=utf-8,' + encodeURIComponent(code));
            }

            builderLog('<br />Completed');

            // setTimeout(function () {
            //     window.close();
            // }, 3000);

            document.getElementById('tip').innerHTML = '构建完毕';
        }
    });
});