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
            'data': './data',
            'tools': './tools',
            'common': './common'
        },
        packages: [
            {
                name: 'echarts',
                location: ecBase + '/echarts-next/src',
                main: 'echarts'
            },
            {
                name: 'zrender',
                location: ecBase + '/zrender-dev3.0/src',
                main: 'zrender'
            },
            {
                name: 'echarts2',
                location: ecBase + '/echarts2',
                main: 'echarts'
            }
        ]
    });


})();