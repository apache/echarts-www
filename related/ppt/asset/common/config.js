(function () {

    var debug = false;

    var ecBase = debug
        ? '/sushuangwork/met/act/gitall/echarts'
        : '.';

    require.config({
        baseUrl: '../',
        paths: {
            'geoJson': ecBase + '/echarts-next/geoData/geoJson',
            'theme': ecBase + '/echarts-next/theme',
            'data': './data'
        },
        packages: [
            {
                main: 'echarts',
                location: ecBase + '/echarts-next/src',
                name: 'echarts'
            },
            {
                main: 'zrender',
                location: ecBase + '/zrender-dev3.0/src',
                name: 'zrender'
            }
        ],
        urlArgs: '_v_=' + (debug ? '' : +new Date())
    });


})();