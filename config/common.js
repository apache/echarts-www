module.exports = {

    cdnThirdParty: {
        jquery: 'https://fastly.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js',
        jquery_1_11_3: 'https://fastly.jsdelivr.net/npm/jquery@1.11.3/dist/jquery.min.js',
        bootstrapCSS: 'https://fastly.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css',
        bootstrapJS: 'https://fastly.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js',
        lodash: 'https://fastly.jsdelivr.net/npm/lodash@3.10.1/index.min.js',
        perfectScrollbarJS: 'https://fastly.jsdelivr.net/npm/perfect-scrollbar@0.6.8/dist/js/min/perfect-scrollbar.min.js',
        perfectScrollbarCSS: 'https://fastly.jsdelivr.net/npm/perfect-scrollbar@0.6.8/dist/css/perfect-scrollbar.min.css',
        paceProgressBarJS: 'https://fastly.jsdelivr.net/npm/pace-progressbar@1.0.2/pace.min.js',
        sweetalertJS: 'https://fastly.jsdelivr.net/npm/sweetalert@2.1.2/dist/sweetalert.min.js',
        echartsMinJS_4_8_0: 'https://fastly.jsdelivr.net/npm/echarts@4.8.0/dist/echarts.min.js',
        prettifyJS: 'https://fastly.jsdelivr.net/npm/code-prettify@0.1.0/src/prettify.min.js',
        // Can not find good prettify css in jsdelivr.
        // prettifyCSS: 'https://fastly.jsdelivr.net/npm/code-prettify@0.1.0/styles/doxy.css',
        prettifyCSSHandlerJS: 'https://fastly.jsdelivr.net/npm/code-prettify@0.1.0/src/lang-css.js',
        jqueryLazyloadJS: 'https://fastly.jsdelivr.net/npm/jquery-lazyload@1.9.7/jquery.lazyload.min.js',

        // CDN for doc
        vueJS: 'https://fastly.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
        elementUIJS: 'https://fastly.jsdelivr.net/npm/element-ui@2.13.2/lib/index.js',
        elementUICSS: 'https://fastly.jsdelivr.net/npm/element-ui@2.13.2/lib/theme-chalk/index.css',
        codeMirrorJS: 'https://fastly.jsdelivr.net/npm/codemirror@5.56.0/lib/codemirror.min.js',
        codeMirrorJSModeJS: 'https://fastly.jsdelivr.net/npm/codemirror@5.56.0/mode/javascript/javascript.js',
        beautifierJS: 'https://fastly.jsdelivr.net/npm/js-beautify@1.11.0/js/lib/beautifier.min.js',
    },

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
            desc: 'AngularJs bindings for Baidu ECharts.',
            descEN: 'AngularJs bindings for Baidu ECharts.'
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
            desc: 'AngularJs 版 ECharts，支持最新 ECharts3.x。',
            descEN: 'AngularJs version ECharts, supports the latest ECharts3.x.'
        }, {
            image: '',
            name: 'vue-echarts',
            website: 'https://github.com/Justineo/vue-echarts',
            authors: [{
                name: 'Justineo',
                website: 'https://github.com/Justineo'
            }],
            desc: 'ECharts component for Vue.js.',
            descEN: 'ECharts component for Vue.js.'
        }, {
            image: '',
            name: 'vue-echarts',
            website: 'https://github.com/panteng/vue-echarts',
            authors: [{
                name: 'panteng',
                website: 'https://github.com/panteng'
            }],
            desc: 'A custom directive for using Echarts in Vue.js apps.',
            descEN: 'A custom directive for using Echarts in Vue.js apps.'
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
            desc: '一个简单的 ECharts 的 react 封装。',
            descEN: 'A simple ECharts react package.'
        }, {
            image: '',
            name: 'react-echarts',
            website: 'https://github.com/somonus/react-echarts',
            authors: [{
                name: 'somonus',
                website: 'https://github.com/somonus'
            }],
            desc: 'ECharts + react.',
            descEN: 'ECharts + react.'
        }, {
            image: '',
            name: 're-echarts',
            website: 'https://github.com/liekkas/re-echarts',
            authors: [{
                name: 'liekkas',
                website: 'https://github.com/liekkas'
            }],
            desc: 'ECharts + react.',
            descEN: 'ECharts + react.'
        }],

        language: [{
            image: '',
            name: 'pyecharts',
            website: 'https://github.com/pyecharts/pyecharts/',
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
            desc: 'Python Echarts Plotting Library.',
            descEN: 'Python Echarts Plotting Library.'
        }, {
            image: '',
            name: 'echarts-python',
            website: 'https://github.com/yufeiminds/echarts-python',
            authors: [{
                name: 'yufeiminds',
                website: 'https://github.com/yufeiminds'
            }],
            desc: 'Generate Echarts options with Python.',
            descEN: 'Generate Echarts options with Python.'
        }, {
            image: '',
            name: 'krisk',
            website: 'https://github.com/napjon/krisk',
            authors: [{
                name: 'napjon',
                website: 'https://github.com/napjon'
            }],
            desc: 'Krisk bring Echarts to Python, and helpful tools for statistical interactive visualization.',
            descEN: 'Krisk bring Echarts to Python, and helpful tools for statistical interactive visualization.'
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
            image: 'echarty.png',
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
            website: 'https://github.com/slamdata/purescript-echarts/',
            authors: [{
                name: 'slamdata',
                website: 'https://github.com/slamdata'
            }],
            desc: 'Purescript bindings for Echarts library.',
            descEN: 'Purescript bindings for Echarts library.'
        }, {
            image: '',
            name: 'iOS-Echarts',
            website: 'https://github.com/Pluto-Y/iOS-Echarts',
            authors: [{
                name: 'Pluto-Y',
                website: 'https://github.com/Pluto-Y/'
            }],
            desc: 'This is a highly custom chart control for iOS and Mac apps, which build with ECharts 2.',
            descEN: 'This is a highly custom chart control for iOS and Mac apps, which build with ECharts 2.'
        }, {
            image: '',
            name: 'ECharts-Java',
            website: 'https://github.com/abel533/ECharts',
            authors: [{
                name: 'abel533',
                website: 'https://github.com/abel533'
            }],
            desc: '这是一个针对 ECharts2.x 版本的 Java 类库，实现了所有 ECharts 中的 JSON 结构对应的 Java 对象。',
            descEN: 'This is a Java version of the ECharts2.x version that implements the Java objects corresponding to the JSON structure in all ECharts.'
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
            desc: 'A PHP library that works as a wrapper for Echarts.',
            descEN: 'A PHP library that works as a wrapper for Echarts.'
        }, {
            image: '',
            name: 'flutter_echarts',
            website: 'https://github.com/entronad/flutter_echarts',
            authors: [{
                name: 'entronad',
                website: 'https://github.com/entronad'
            }],
            desc: 'A Flutter widget to use Echarts in a reactive way.',
            descEN: 'A Flutter widget to use Echarts in a reactive way.'
        }],
        chartType: [{
            image: 'gl.png',
            name: 'ECharts GL',
            website: 'https://github.com/ecomfe/echarts-gl',
            authors: [{
                name: '沈毅',
                website: 'https://github.com/pissang'
            }],
            desc: '3D 图表、地理可视化、WebGL 加速渲染',
            descEN: 'ECharts-GL provides 3D plots, globe visualization and WebGL acceleration.'
        }, {
            image: 'word-cloud.jpg',
            name: '字符云',
            website: 'https://github.com/ecomfe/echarts-wordcloud',
            authors: [{
                name: '沈毅',
                website: 'https://github.com/pissang'
            }],
            desc: '字符云可以将文字根据不同的权重布局为大小、颜色各异的图，支持使用图片作为遮罩。',
            descEN: 'Cloud charts can layout text into different sizes and colors. You can also use images as masks.'
        }, {
            image: 'liquidfill.jpg',
            name: '水球图',
            website: 'https://github.com/ecomfe/echarts-liquidfill',
            authors: [{
                name: '羡辙',
                website: 'https://github.com/Ovilia'
            }],
            desc: '水球图是一种适合于展现单个百分比数据的图表，支持多条水波和动画。',
            descEN: 'The liquid-fill chart is a chart suitable for presenting a single percentage of data, supporting multiple water waves and animations.'
        }, {
            image: 'bmap.jpg',
            name: '百度地图',
            website: 'https://github.com/apache/echarts/tree/master/extension-src/bmap',
            authors: [{
                name: '沈毅',
                website: 'https://github.com/pissang'
            }],
            desc: '百度地图扩展，可以在百度地图上展现点图、线图、热力图及饼图等。',
            descEN: 'With Baidu map extension, you can display scatter charts, lines charts, heatmaps, pie charts and so on.'
        }, {
            image: 'arcgis.jpg',
            name: 'ArcGIS 地图',
            website: 'https://github.com/wandergis/arcgis-echarts3',
            authors: [{
                name: 'wandergis',
                website: 'https://github.com/wandergis'
            }],
            desc: 'ArcGIS 地图和 ECharts 的结合。',
            descEN: 'A combination of ArcGIS maps and ECharts.'
        }, {
            image: 'leaflet-2.jpg',
            name: 'echarts-leaflet',
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
            website: 'https://github.com/lzxue/echartsLayer',
            authors: [{
                name: 'lzxue',
                website: 'https://github.com/lzxue'
            }],
            desc: 'Mapbox 地图和 ECharts 的结合。',
            descEN: 'A combination of Mapbox maps and ECharts.'
        }, {
            image: 'amap.jpg',
            name: '高德地图',
            website: 'https://github.com/plainheart/echarts-extension-amap',
            authors: [{
                name: 'plainheart',
                website: 'https://github.com/plainheart'
            }],
            desc: '高德地图扩展，可以在高德地图上展现点图、线图、热力图及饼图等。',
            descEN: 'AMap extension for ECharts which is used to display visualizations such as Scatter, Lines, Heatmap and Pie.'
        }],
        functional: [{
            image: 'modularity.jpg',
            name: '图的模块化',
            website: 'https://github.com/ecomfe/echarts-graph-modularity',
            authors: [{
                name: '沈毅',
                website: 'https://github.com/pissang'
            }],
            desc: '该插件可以对 ECharts Graph 图作社群检测，并将图中的顶点分成若干子集。',
            descEN: 'The plugin can perform community detection on the ECharts Graph and divide the vertices in the graph into subsets.'
        }, {
            image: 'stat.jpg',
            name: '统计工具',
            website: 'https://github.com/ecomfe/echarts-stat',
            authors: [{
                name: '李德清',
                website: 'https://github.com/deqingli'
            }],
            desc: '统计扩展是一个专门用来进行数据分析的工具。',
            descEN: 'The statistical extension is a tool for data analysis.'
        }]
    }
};
