

// const exampleConfig = {
//     datGUIMinJS: `https://fastly.jsdelivr.net/npm/dat.gui@0.6.5/build/dat.gui.min.js`,
//     monacoDir: `https://fastly.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs`,
//     aceDir: `https://fastly.jsdelivr.net/npm/ace-builds@1.4.12/src-min-noconflict`,
//     prettierDir: `https://fastly.jsdelivr.net/npm/prettier@2.3.2`,
//     seedrandomJS: `https://fastly.jsdelivr.net/npm/seedrandom@3.0.5/seedrandom.min.js`,
//     jQueryJS: `https://fastly.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js`,
//     acornJS: `https://fastly.jsdelivr.net/npm/acorn@8.7.1/dist/acorn.min.js`,
// };

  
const thirdPartyLinks = {
    lazyloadJS: './js/vendors/vanilla-lazyload@12.0.3/lazyload.min.js',

    jquery: './js/vendors/jquery@3.7.1/dist/jquery.min.js',
    bootstrapCSS: './js/vendors/bootstrap@3.3.7/css/bootstrap.min.css',
    bootstrapJS: './js/vendors/bootstrap@3.3.7/js/bootstrap.min.js',
    lodash: './js/vendors/lodash@3.10.1/lodash.min.js',
    paceProgressBarJS: './js/vendors/pace-js@1.2.4/pace.min.js',
    sweetalertJS: './js/vendors/sweetalert@2.1.2/sweetalert.min.js',
    echartsMinJS_4_8_0: './js/vendors/echarts@4.8.0/echarts.min.js',
    prettifyJS: './js/vendors/code-prettify@0.1.0/prettify.min.js',
    // Can not find good prettify css in jsdelivr.
    // prettifyCSS: './js/vendors/code-prettify@0.1.0/styles/doxy.css',
    prettifyCSSHandlerJS: './js/vendors/code-prettify@0.1.0/lang-css.js',

    // CDN for doc
    vueJS: './js/vendors/vue@2.6.14/vue.min.js',
    elementUIJS: './js/vendors/element-ui@2.15.14/index.js',
    elementUICSS: './js/vendors/element-ui@2.15.14/lib/theme-chalk/index.css',
    codeMirrorJS: './js/vendors/codemirror@5.56.0/codemirror.min.js',
    codeMirrorJSModeJS: './js/vendors/codemirror@5.56.0/mode/javascript/javascript.js',
    beautifierJS: './js/vendors/js-beautify@1.11.0/beautifier.min.js',

    scrollRevealJS: './js/vendors/scrollReveal.js@4.0.7/scrollreveal.min.js',
    lottieJS: './js/vendors/lottie-web@5.7.6/lottie.min.js',
}


module.exports = {

    // cdnThirdParty: {
    //     jquery: 'https://fastly.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
    //     bootstrapCSS: 'https://fastly.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css',
    //     bootstrapJS: 'https://fastly.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js',
    //     lodash: 'https://fastly.jsdelivr.net/npm/lodash@3.10.1/index.min.js',
    //     paceProgressBarJS: 'https://fastly.jsdelivr.net/npm/pace-js@1.2.4/pace.min.js',
    //     sweetalertJS: 'https://fastly.jsdelivr.net/npm/sweetalert@2.1.2/dist/sweetalert.min.js',
    //     echartsMinJS_4_8_0: 'https://fastly.jsdelivr.net/npm/echarts@4.8.0/dist/echarts.min.js',
    //     prettifyJS: 'https://fastly.jsdelivr.net/npm/code-prettify@0.1.0/src/prettify.min.js',
    //     // Can not find good prettify css in jsdelivr.
    //     // prettifyCSS: 'https://fastly.jsdelivr.net/npm/code-prettify@0.1.0/styles/doxy.css',
    //     prettifyCSSHandlerJS: 'https://fastly.jsdelivr.net/npm/code-prettify@0.1.0/src/lang-css.js',

    //     // CDN for doc
    //     vueJS: 'https://fastly.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
    //     elementUIJS: 'https://fastly.jsdelivr.net/npm/element-ui@2.15.14/lib/index.js',
    //     elementUICSS: 'https://fastly.jsdelivr.net/npm/element-ui@2.15.14/lib/theme-chalk/index.css',
    //     codeMirrorJS: 'https://fastly.jsdelivr.net/npm/codemirror@5.56.0/lib/codemirror.min.js',
    //     codeMirrorJSModeJS: 'https://fastly.jsdelivr.net/npm/codemirror@5.56.0/mode/javascript/javascript.js',
    //     beautifierJS: 'https://fastly.jsdelivr.net/npm/js-beautify@1.11.0/js/lib/beautifier.min.js',
    // },

    // cdnThirdPartyCN: {
    //     jquery: 'https://registry.npmmirror.com/jquery/3.7.1/files/dist/jquery.min.js',
    //     bootstrapCSS: 'https://lib.baomitu.com/twitter-bootstrap/3.3.7/css/bootstrap.min.css',
    //     bootstrapJS: 'https://lib.baomitu.com/twitter-bootstrap/3.3.7/js/bootstrap.min.js',
    //     lodash: 'https://lib.baomitu.com/lodash.js/3.10.1/lodash.min.js',
    //     paceProgressBarJS: 'https://lib.baomitu.com/pace/1.2.4/pace.min.js',
    //     sweetalertJS: 'https://lib.baomitu.com/sweetalert/2.1.2/sweetalert.min.js',
    //     echartsMinJS_4_8_0: 'https://lib.baomitu.com/echarts/4.8.0/echarts.min.js',
    //     prettifyJS: 'https://registry.npmmirror.com/code-prettify/0.1.0/files/src/prettify.js',
    //     prettifyCSSHandlerJS: 'https://registry.npmmirror.com/code-prettify/0.1.0/files/src/lang-css.js',

    //     // CDN for doc
    //     vueJS: 'https://lib.baomitu.com/vue/2.6.14/vue.min.js',
    //     elementUIJS: 'https://lib.baomitu.com/element-ui/2.15.14/index.min.js',
    //     elementUICSS: 'https://lib.baomitu.com/element-ui/2.15.14/theme-chalk/index.min.css',
    //     codeMirrorJS: 'https://lib.baomitu.com/codemirror/5.56.0/codemirror.min.js',
    //     codeMirrorJSModeJS: 'https://lib.baomitu.com/codemirror/5.56.0/mode/javascript/javascript.min.js',
    //     beautifierJS: 'https://lib.baomitu.com/js-beautify/1.11.0/beautifier.min.js',
    // },

    cdnThirdParty: thirdPartyLinks,
    cdnThirdPartyCN: thirdPartyLinks,

    // Source folder of echarts
    echartsPath: '../echarts',
    // Target folder of echarts
    zrenderPath: '../zrender',

    // Parameters for builder
    charts: {
        bar: ['柱状图', 'Bar', true],
        line: ['折线图', 'Line', true],
        pie: ['饼图', 'Pie', true],
        scatter: ['散点图', 'Scatter'],
        effectScatter: ['涟漪散点图', 'EffectScatter'],
        candlestick: ['K线图', 'Candlestick'],
        radar: ['雷达图', 'Radar'],
        heatmap: ['热力图', 'Heatmap'],
        tree: ['树图', 'Tree'],
        treemap: ['矩形树图', 'Treemap'],
        sunburst: ['旭日图', 'Sunburst'],
        map: ['地图', 'Map'],
        lines: ['线图', 'Lines'],
        graph: ['关系图', 'Graph'],
        boxplot: ['箱线图', 'Boxplot'],
        parallel: ['平行坐标', 'Parallel'],
        gauge: ['仪表盘', 'Gauge'],
        funnel: ['漏斗图', 'Funnel'],
        sankey: ['桑基图', 'Sankey'],
        themeRiver: ['主题河流图', 'ThemeRiver'],
        pictorialBar: ['象形柱图', 'PictorialBar'],
        custom: ['自定义系列', 'Custom']
    },
    coords: {
        gridSimple: ['直角坐标系', 'Grid', true],
        polar: ['极坐标系', 'Polar'],
        geo: ['地理坐标系', 'Geo'],
        singleAxis: ['单轴', 'SingleAxis'],
        calendar: ['日历', 'Calendar']
    },
    components: {
        title: ['标题', 'Title', true],
        legend: ['图例', 'Legend', true, 'legendScroll'],
        tooltip: ['提示框', 'Tooltip', true],
        markPoint: ['标注', 'MarkPoint'],
        markLine: ['标线', 'MarkLine'],
        markArea: ['标域', 'MarkArea'],
        timeline: ['时间轴', 'Timeline'],
        dataZoom: ['数据区域缩放', 'DataZoom'],
        brush: ['刷选', 'Brush'],
        visualMap: ['视觉映射', 'VisualMap'],
        toolbox: ['工具栏', 'Toolbox'],
        graphic: ['自定义图形', 'Graphic']
    },

    // Parameters for map download
    provincePinyin: ['hebei','shanxi','neimenggu','liaoning','jilin','heilongjiang','jiangsu','zhejiang','anhui','fujian','jiangxi','shandong','henan','hubei','hunan','guangdong','guangxi','hainan','sichuan','guizhou','yunnan','xizang','shanxi1','gansu','qinghai','ningxia','xinjiang', 'beijing', 'tianjin', 'shanghai', 'chongqing', 'xianggang', 'aomen', 'taiwan'],
    province: ['河北', '山西', '内蒙古', '辽宁', '吉林','黑龙江',  '江苏', '浙江', '安徽', '福建', '江西', '山东','河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '上海', '重庆', '香港', '澳门', '台湾'],

    theme: ['vintage', 'dark', 'macarons', 'infographic', 'shine', 'roma'],

    extensions: {
        framework: [{
            image: '',
            name: 'angular-echarts',
            website: 'https://github.com/wangshijun/angular-echarts',
            authors: [{
                name: 'wangshijun',
                website: 'https://github.com/wangshijun'
            }],
            desc: 'AngularJs bindings for ECharts.',
            descEN: 'AngularJs bindings for ECharts.'
        }, {
            image: '',
            name: 'echarts-ng',
            website: 'https://github.com/bornkiller/echarts-ng',
            authors: [{
                name: 'bornkiller',
                website: 'https://github.com/bornkiller'
            }],
            desc: '使用 Angular 封装 ECharts 为指令。',
            descEN: 'Encapsulate ECharts as an instruction using Angular.'
        }, {
            image: '',
            name: 'ng-echarts',
            website: 'https://github.com/liekkas/ng-echarts',
            authors: [{
                name: 'liekkas',
                website: 'https://github.com/liekkas'
            }],
            desc: 'AngularJs 版 ECharts，支持 ECharts 3。',
            descEN: 'AngularJs version for ECharts 3.'
        }, {
            image: '',
            name: 'vue-echarts',
            website: 'https://github.com/ecomfe/vue-echarts',
            authors: [{
                name: 'Justineo',
                website: 'https://github.com/Justineo'
            }],
            desc: 'Apache ECharts 的 Vue.js 组件。',
            descEN: 'Vue.js component for Apache ECharts.'
        }, {
            image: '',
            name: 'vue-echarts',
            website: 'https://github.com/panteng/vue-echarts',
            authors: [{
                name: 'panteng',
                website: 'https://github.com/panteng'
            }],
            desc: 'A custom directive for using ECharts in Vue.js apps.',
            descEN: 'A custom directive for using ECharts in Vue.js apps.'
        }, {
            image: '',
            name: 'echarts-middleware',
            website: 'https://github.com/PUGE/echarts-middleware',
            authors: [{
                name: 'PUGE',
                website: 'https://github.com/PUGE'
            }],
            desc: '在 Vue 中优雅高效地使用 ECharts。',
            descEN: 'Use ECharts elegantly and efficiently with Vue.'
        }, {
            image: '',
            name: 'echarts-for-react',
            website: 'https://github.com/hustcc/echarts-for-react',
            authors: [{
                name: 'hustcc',
                website: 'https://github.com/hustcc'
            }],
            desc: '一个简单的 Apache ECharts 的 React 封装。',
            descEN: 'Apache ECharts components for React wrapper.'
        }, {
            image: '',
            name: 'react-echarts',
            website: 'https://github.com/somonus/react-echarts',
            authors: [{
                name: 'somonus',
                website: 'https://github.com/somonus'
            }],
            desc: 'ECharts + React.',
            descEN: 'ECharts + React.'
        }, {
            image: '',
            name: 're-echarts',
            website: 'https://github.com/liekkas/re-echarts',
            authors: [{
                name: 'liekkas',
                website: 'https://github.com/liekkas'
            }],
            desc: 'ECharts + React.',
            descEN: 'ECharts + React.'
        }],

        language: [{
            image: '',
            name: 'pyecharts',
            website: 'https://github.com/pyecharts/pyecharts',
            authors: [{
                name: 'chenjiandongx',
                website: 'https://github.com/chenjiandongx'
            }, {
                name: 'chfw',
                website: 'https://github.com/chfw'
            }, {
                name: 'kinegratii',
                website: 'https://github.com/kinegratii'
            }],
            desc: 'Python ECharts Plotting Library.',
            descEN: 'Python ECharts Plotting Library.'
        }, {
            image: '',
            name: 'echarts-python',
            website: 'https://github.com/yufeiminds/echarts-python',
            authors: [{
                name: 'yufeiminds',
                website: 'https://github.com/yufeiminds'
            }],
            desc: 'Generate ECharts options with Python.',
            descEN: 'Generate ECharts options with Python.'
        }, {
            image: '',
            name: 'krisk',
            website: 'https://github.com/napjon/krisk',
            authors: [{
                name: 'napjon',
                website: 'https://github.com/napjon'
            }],
            desc: 'Krisk brings ECharts to Python, and helpful tools for statistical interactive visualization.',
            descEN: 'Krisk brings ECharts to Python, and helpful tools for statistical interactive visualization.'
        }, {
            image: '',
            name: 'Rails Charts',
            website: 'https://github.com/railsjazz/rails_charts',
            authors: [{
                name: 'Rails Charts',
                website: 'https://github.com/railsjazz/rails_charts'
            }],
            desc: 'Rails Charts提供了一个Ruby gem，可以在Ruby on Rails应用程序中使用图表。',
            descEN: 'Rails Charts provides a Ruby gem enabling use of ECharts in Ruby on Rails applications.'
        }, {
            image: 'echarty.jpg',
            name: 'echarty',
            website: 'https://github.com/helgasoft/echarty',
            authors: [{
                name: 'helgasoft',
                website: 'https://github.com/helgasoft'
            }],
            desc: 'echarty 提供了 ECharts 的 R 语言接口。',
            descEN: 'A thin R/Shiny interface covers full functionality of ECharts.'
        }, {
            image: '',
            name: 'recharts',
            website: 'https://github.com/taiyun/recharts',
            authors: [{
                name: 'taiyun',
                website: 'https://github.com/taiyun'
            }],
            desc: 'recharts 提供了 ECharts 的 R 语言接口。',
            descEN: 'recharts provides the R language interface of ECharts.'
        }, {
            image: '',
            name: 'recharts',
            website: 'https://github.com/yihui/recharts',
            authors: [{
                name: 'yihui',
                website: 'https://github.com/yihui'
            }],
            desc: 'An R Interface to ECharts.',
            descEN: 'An R Interface to ECharts.'
        }, {
            image: '',
            name: 'ECharts2Shiny',
            website: 'https://github.com/XD-DENG/ECharts2Shiny',
            authors: [{
                name: 'XD-DENG',
                website: 'https://github.com/XD-DENG'
            }],
            desc: 'To insert interactive charts from ECharts into R Shiny applications.',
            descEN: 'To insert interactive charts from ECharts into R Shiny applications.'
        }, {
            image: '',
            name: 'ECharts.jl',
            website: 'https://github.com/randyzwitch/ECharts.jl',
            authors: [{
                name: 'randyzwitch',
                website: 'https://github.com/randyzwitch'
            }],
            desc: 'Julia package for the ECharts 3 visualization library.',
            descEN: 'Julia package for the ECharts 3 visualization library.'
        }, {
            image: '',
            name: 'purescript-echarts',
            website: 'https://github.com/slamdata/purescript-echarts',
            authors: [{
                name: 'slamdata',
                website: 'https://github.com/slamdata'
            }],
            desc: 'Purescript bindings for ECharts library.',
            descEN: 'Purescript bindings for ECharts library.'
        }, {
            image: '',
            name: 'iOS-Echarts',
            website: 'https://github.com/Pluto-Y/iOS-Echarts',
            authors: [{
                name: 'Pluto-Y',
                website: 'https://github.com/Pluto-Y'
            }],
            desc: 'This is a highly custom chart control for iOS and Mac apps, which builds with ECharts 2.',
            descEN: 'This is a highly custom chart control for iOS and Mac apps, which builds with ECharts 2.'
        }, {
            image: '',
            name: 'ECharts-Java',
            website: 'https://github.com/abel533/ECharts',
            authors: [{
                name: 'abel533',
                website: 'https://github.com/abel533'
            }],
            desc: '这是一个针对 ECharts 2 的 Java 类库，实现了所有 ECharts 中的 JSON 结构对应的 Java 对象。',
            descEN: 'This is a Java version of the ECharts 2 that implements the Java objects corresponding to the JSON structure in all ECharts.'
        }, {
            image: '',
            name: 'EChartsSDK',
            website: 'https://github.com/idoku/EChartsSDK',
            authors: [{
                name: 'idoku',
                website: 'https://github.com/idoku'
            }],
            desc: 'ECharts 的 .NET 类库，从 ECharts 的 Java 类库移植。',
            descEN: 'ECharts .NET class library, ported from ECharts Java class library.'
        }, {
            image: '',
            name: 'Echarts-PHP',
            website: 'https://github.com/hisune/Echarts-PHP',
            authors: [{
                name: 'hisune',
                website: 'https://github.com/hisune'
            }],
            desc: 'A PHP library that works as a wrapper for ECharts.',
            descEN: 'A PHP library that works as a wrapper for ECharts.'
        }, {
            image: '',
            name: 'flutter_echarts',
            website: 'https://github.com/entronad/flutter_echarts',
            authors: [{
                name: 'entronad',
                website: 'https://github.com/entronad'
            }],
            desc: 'A Flutter widget to use ECharts in a reactive way.',
            descEN: 'A Flutter widget to use ECharts in a reactive way.'
        }],
        chartType: [{
            image: 'gl.png',
            name: 'ECharts GL',
            website: 'https://github.com/ecomfe/echarts-gl',
            authors: [{
                name: 'pissang',
                website: 'https://github.com/pissang'
            }],
            desc: '3D 图表、地理可视化、WebGL 加速渲染',
            descEN: 'ECharts-GL provides 3D plots, globe visualization and WebGL acceleration.'
        }, {
            image: 'word-cloud.jpg',
            name: '字符云',
            nameEn: 'Wordcloud',
            website: 'https://github.com/ecomfe/echarts-wordcloud',
            authors: [{
                name: 'pissang',
                website: 'https://github.com/pissang'
            }, {
                name: 'Ovilia',
                website: 'https://github.com/Ovilia'
            }],
            desc: '字符云可以将文字根据不同的权重布局为大小、颜色各异的图，支持使用图片作为遮罩。',
            descEN: 'Cloud charts can layout text into different sizes and colors. You can also use images as masks.'
        }, {
            image: 'liquidfill.jpg',
            name: '水球图',
            nameEn: 'Liquidfill',
            website: 'https://github.com/ecomfe/echarts-liquidfill',
            authors: [{
                name: 'Ovilia',
                website: 'https://github.com/Ovilia'
            }, {
                name: 'pissang',
                website: 'https://github.com/pissang'
            }],
            desc: '水球图是一种适合于展现单个百分比数据的图表，支持多条水波和动画。',
            descEN: 'The liquid-fill chart is a chart suitable for presenting a single percentage of data, supporting multiple water waves and animations.'
        }, {
            image: 'bmap.jpg',
            name: '百度地图',
            website: 'https://github.com/apache/echarts/tree/master/extension-src/bmap',
            authors: [{
                name: 'pissang',
                website: 'https://github.com/pissang'
            }, {
                name: 'plainheart',
                website: 'https://github.com/plainheart'
            }],
            desc: '百度地图扩展，可以在百度地图上展现点图、线图、热力图及饼图等。',
            descEN: 'With Baidu map extension, you can display scatter charts, lines charts, heatmaps, pie charts and so on.',
            onlyZH: true
        }, {
            image: 'amap.jpg',
            name: '高德地图',
            website: 'https://github.com/plainheart/echarts-extension-amap',
            authors: [{
                name: 'plainheart',
                website: 'https://github.com/plainheart'
            }],
            desc: '高德地图扩展，可以在高德地图上展现点图、线图、热力图及饼图等。',
            descEN: 'AMap extension for ECharts which is used to display visualizations such as Scatter, Lines, Heatmap and Pie.',
            onlyZH: true
        }, {
            image: 'gmap.jpg',
            name: '谷歌地图',
            nameEn: 'Google Maps',
            website: 'https://github.com/plainheart/echarts-extension-gmap',
            authors: [{
                name: 'plainheart',
                website: 'https://github.com/plainheart'
            }],
            desc: '谷歌地图扩展，可以在谷歌地图上展现点图、线图、热力图及饼图等。',
            descEN: 'Google Maps extension for ECharts which is used to display visualizations such as Scatter, Lines, Heatmap and Pie.'
        }, {
            image: 'leaflet-2.jpg',
            name: 'Leaflet 地图',
            nameEn: 'Leaflet Maps',
            website: 'https://github.com/gnijuohz/echarts-leaflet',
            authors: [{
                name: 'gnijuohz',
                website: 'https://github.com/gnijuohz'
            }],
            desc: 'ECharts extension for visualizing data on leaftlet.',
            descEN: 'ECharts extension for visualizing data on leaftlet.'
        }, {
            image: 'mapbox.jpg',
            name: 'Mapbox 地图',
            nameEn: 'Mapbox Maps',
            website: 'https://github.com/lzxue/echartsLayer',
            authors: [{
                name: 'lzxue',
                website: 'https://github.com/lzxue'
            }],
            desc: 'Mapbox 地图和 ECharts 的结合。',
            descEN: 'A combination of Mapbox maps and ECharts.'
        }, {
            image: 'arcgis.jpg',
            name: 'ArcGIS 地图',
            nameEn: 'ArcGIS Maps',
            website: 'https://github.com/wandergis/arcgis-echarts3',
            authors: [{
                name: 'wandergis',
                website: 'https://github.com/wandergis'
            }],
            desc: 'ArcGIS 地图和 ECharts 3 的结合。',
            descEN: 'A combination of ArcGIS maps and ECharts 3.'
        }],
        functional: [{
            image: 'modularity.jpg',
            name: '图的模块化',
            nameEn: 'Graph Modularity',
            website: 'https://github.com/ecomfe/echarts-graph-modularity',
            authors: [{
                name: 'pissang',
                website: 'https://github.com/pissang'
            }],
            desc: '该插件可以对 ECharts Graph 图作社群检测，并将图中的顶点分成若干子集。',
            descEN: 'The plugin can perform community detection on the ECharts Graph and divide the vertices in the graph into subsets.'
        }, {
            image: 'stat.jpg',
            name: '统计工具',
            nameEn: 'Statistics Tool',
            website: 'https://github.com/ecomfe/echarts-stat',
            authors: [{
                name: 'deqingli',
                website: 'https://github.com/deqingli'
            }, {
                name: '100pah',
                website: 'https://github.com/100pah'
            }],
            desc: '统计扩展是一个专门用来进行数据分析的工具。',
            descEN: 'The statistical extension is a tool for data analysis.'
        }]
    }
};
