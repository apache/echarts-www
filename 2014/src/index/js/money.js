define(function(require) {
    var instanceBar;
    var instanceScatter;
    var echarts = require('echarts');
    var country = require('../../data/team');
    var countryData = require('../../data/countryAbility');
    var ecConfig = require('echarts/config');
    require('echarts/chart/bar');
    require('echarts/chart/scatter');

    var selectedCountry = '';
    var selectedPos = '全部';
    var selectedIndex = 0;

    function init() {
        instanceBar = echarts.init(document.getElementById('moneyChartBar'));
        instanceScatter = echarts.init(document.getElementById('moneyChartScatter'));

        var barOption = {
            title: {
                x: 80,
                text: '32强球队身价/能力对比图'
            },
            color: ['rgba(225, 70, 68, 1)', 'rgba(244, 211, 32, 1)'],
            grid: {
                x: 80,
                y: 50,
                x2: 20,
                y2: 40
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                selectedMode: 'single',
                selected: {
                    '平均能力': false
                },
                x: 'right',
                data: ['身价', '平均能力']
            },
            xAxis: [
                {
                    type: 'value',
                    scale: true,
                    splitLine: {
                        lineStyle: {
                            color: '#eee'
                        }
                    },
                    axisLabel: {
                        formatter: function(val) {
                            if (val > 10000) {
                                return ((val / 100000000).toFixed(1) + '亿');
                            }
                            else {
                                return val;
                            }
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    data: country,
                    splitNumber: 5,
                    splitLine: {
                        lineStyle: {
                            color: '#eee'
                        }
                    },
                    axisLabel: {
                        //rotate: -30
                        interval: 0
                    }
                }
            ]
        }

        instanceBar.setOption(barOption);
        setBarData('全部');

        var scatterOption = {
            title: {
                x: 80,
                text: '32强球员身价/能力分布图'
            },
            tooltip: {
                trigger: 'axis',
                showDelay: 0,
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                x: 80,
                y: 50,
                x2: 30,
                y2: 40
            },
            legend: {
                selectedMode: 'single',
                selected: {
                    '前锋': false,
                    '中场': false,
                    '后卫': false,
                    '守门员': false
                },
                x: 'right',
                data: ['全部', '前锋', '中场', '后卫', '守门员']
            },
            xAxis : [
                {
                    type : 'value',
                    power: 1,
                    splitNumber: 4,
                    name: '能力',
                    max: 94,
                    scale: true
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    power: 1,
                    splitNumber: 4,
                    name: '身价',
                    max: 120000000,
                    scale: true,
                    axisLabel: {
                        formatter: function(val) {
                            if (parseInt((val / 10000), 10)) {
                                return parseInt((val / 10000), 10) + '万';
                            }
                            else {
                                return 0;
                            }
                        }
                    }
                }
            ]
        };

        instanceScatter.setOption(scatterOption);
        setScatterData();

        bindEvents();
    }

    function setBarData(pos) {
        var data1 = [];
        var data2 = [];

        if (pos === '全部') {
            pos = 'total';
        }

        sort(selectedIndex, pos);

        $.each(country, function(i, name) {
            data1.push({
                value: countryData[name][pos][0],
                itemStyle: {
                    normal: {
                        color: (function(name) {
                            if (name == selectedCountry) {
                                return 'rgba(225, 70, 68, 0.5)';
                            }
                            else {
                                return 'rgba(225, 70, 68, 1)';
                            }
                        })(name)
                    }
                }
            });
            data2.push({
                value: countryData[name][pos][1],
                itemStyle: {
                    normal: {
                        color: (function(name) {
                            if (name == selectedCountry) {
                                return 'rgba(244, 211, 32, 0.5)';
                            }
                            else {
                                return 'rgba(244, 211, 32, 1)';
                            }
                        })(name)
                    }
                }
            });
        });

        var series = [
            {
                name: '身价',
                type: 'bar',
                itemStyle: {
                    color: 'rgba(225, 70, 68, 1)',
                },
                data: data1
            },
            {
                name: '平均能力',
                type: 'bar',
                itemStyle: {
                    color: 'rgba(244, 211, 32, 1)',
                },
                data: data2
            }
        ];

        instanceBar.setOption({
            yAxis: [{
                data: country
            }]
        });
        instanceBar.setSeries(series, true);
    }

    function setScatterData(country) {
        var players = [];;

        if (!country) {
            $.each(countryData, function(index, item) {
                players = players.concat(item['players']);
            });
        }
        else {
            players = countryData[country]['players'];
        }

        var series = [];
        var symbolList = ['circle', 'rectangle', 'triangle', 'diamond', 'emptyCircle'];
        var posList = ['全部', '前锋', '中场', '后卫', '守门员'];

        $.each(posList, function(i, pos) {
            var data = [];

            $.each(players, function(index, item) {
                if (pos === '全部' || item[3] == pos) {
                    var d = {
                        value: [item[6], item[5], item[4], item[1], item[2]],
                        symbol: symbolList[$.inArray(item[3], posList)],
                        itemStyle: {
                            normal: {
                                color: getColor(item[4], true)
                            }
                        }
                    };
                    data.push(d);
                }
            });

            series.push({
                name: pos,
                type: 'scatter',
                symbol: symbolList[i],
                symbolSize: 5,
                tooltip: {
                    trigger: 'item',
                    formatter: function(args) {
                        var val = args[2];
                        var str = val[3] + ':' + '<br>';
                        str += '年龄:' + val[2] + '<br>';
                        str += '国家:' + val[4] + '<br>';
                        str += '能力:' + val[0] + '<br>';
                        str += '身价:' + val[1];

                        return str;
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#6495ed'
                    }
                },
                data: data
            });
        });

        function getColor(age, isHighlight) {
            var age = age - 0;
            var arr = ['rgba(86, 226, 99, 0)', 'rgba(87, 206, 250, 0)', 'rgba(218, 70, 214, 0)'];
            var arrHighlight = ['rgba(86, 226, 99, 0.7)', 'rgba(87, 206, 250, 0.7)', 'rgba(218, 70, 214, 0.7)'];

            var colorArr;

            if (!isHighlight) {
                colorArr = arr;
            }
            else {
                colorArr = arrHighlight;
            }

            if (age <= 25) {
                return colorArr[0];
            }
            else if (age <= 30) {
                return colorArr[1];
            }
            else {
                return colorArr[2];
            }
        }

        instanceScatter.setSeries(series, true);
    }

    function bindEvents() {
        instanceBar.on(ecConfig.EVENT.CLICK, function(e) {
            if (selectedCountry == e.name) {
                selectedCountry = '';
            }
            else {
                selectedCountry = e.name;
            }
            setBarData(selectedPos);
            setScatterData(selectedCountry);
        });

        instanceBar.on(ecConfig.EVENT.LEGEND_SELECTED, function(e) {
            if (e.target === '身价') {
                selectedIndex = 0;
                instanceBar.setOption({
                    xAxis: {
                        min: 0
                    }
                });
            }
            else {
                instanceBar.setOption({
                    xAxis: {
                        min: 40
                    }
                });
                selectedIndex = 1;
            }
            setBarData(selectedPos);
        });

        instanceScatter.on(ecConfig.EVENT.LEGEND_SELECTED, function(e) {
            setBarData(e.target);
            selectedPos = e.target;
        });
    }

    function load() {
        !instanceBar && init();
    }

    function sort(index, pos) {
        var len = country.length;
        for (var i = 0; i < len; i++) {
            for (var j = i + 1; j < len; j++) {
                if (countryData[country[j]][pos][index] < countryData[country[i]][pos][index]) {
                    var tmp = country[i];
                    country[i] = country[j];
                    country[j] = tmp;
                }
            }
        }
    }

    return {
        load: load
    };
});
