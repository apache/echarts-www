(function () {

    require.config({
        baseUrl: '../',
        paths: {
            'map': '../../asset/map',
            'theme': '../../asset/theme',
            'data': './data',
            'tools': './tools',
            'common': './common'
        },
        packages: [{
            name: 'echarts',
            location: '../../dist/',
            main: 'echarts'
        }]
    });
})();