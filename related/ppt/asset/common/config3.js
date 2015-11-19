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
                name: 'echarts',
                location: ecBase + '/echarts2',
                main: 'echarts'
            }
        ],
        urlArgs: '_v_=' + (debug ? '' : +new Date())
    });


})();