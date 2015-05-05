define(function(require) {

    var isInit = false;
    var rankData = require('../../data/rankData');
    var circleFlagData =require('../../data/circle_flag');

    var echarts = require('echarts');
    require('echarts/chart/scatter');

    var rmChart = echarts.init(document.getElementById('rank-timeline'));
    
    var scatterDataTL = [];

    var countries = ["澳大利亚", "韩国", "喀麦隆", "日本", "尼日利亚", "加纳", "伊朗", "哥斯达黎加", "洪都拉斯", "厄瓜多尔", "阿尔及利亚", "波黑", "科特迪瓦", "克罗地亚", "墨西哥", "俄罗斯", "法国", "荷兰", "美国", "智利", "比利时", "英格兰", "希腊", "意大利", "瑞士", "阿根廷", "乌拉圭", "哥伦比亚", "巴西", "葡萄牙", "德国", "西班牙"];
    var countryIdxMap = {};

    $.each(rankData.rankData, function(i, country) {
        var name = country[0];
        countryIdxMap[name] = countries.length;
        //countries.push(name);
    });

    $.each(rankData.timeData, function(i0, time) {
        scatterDataTL[i0] = [];

        $.each(rankData.rankData, function(i, country) {
            var name = country[0];
            var imageUrl = circleFlagData[name];
            scatterDataTL[i0].push({
                symbol: imageUrl && 'image://' + imageUrl,
                value: [name, parseInt(country[i0 + 1])]
            });
        });
    })

    $.each(scatterDataTL, function(index, item) {
        $.each(item, function(i, arr) {
            $.each(arr, function(j, obj) {
                obj[1] = 80 - obj[1];
            });
        });
    });

    var option = {
        timeline: {
            data: rankData.timeData,
            autoPlay: true,
            playInterval: 500,
            label: {
                interval: 0,
                show: false
            },
            x: 30,
            x2: 30,
            type: 'number'
        },
        toolbox: {
            show: false
        },
        options: [
            {
                title: {
                    text : '2010年7月 FIFA排名'
                },
                grid: {
                    x: 30,
                    y: 40,
                    x2: 30,
                    y2: 50
                },
                xAxis: {
                    type: 'category',
                    data: countries,
                    axisLabel: {
                        // interval: 0,
                        // rotate: 50
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: false
                    }
                },
                tooltip: {
                    show: true,
                    formatter: function(arg) {
                        var data = arg[2];
                        return data[0] + ':' + (80 - data[1]);
                    }
                },
                series: [{
                    type: 'scatter',
                    data: scatterDataTL[0],
                    symbolSize: 15
                }]
            }
        ]
    }

    $.each(scatterDataTL, function(idx, item) {
        if (idx > 0) {
            option.options.push({
                title: {
                    text: rankData.timeData[idx] + ' FIFA排名'
                },
                xAxis: {
                    type: 'category',
                    data: 'countries'
                },
                series:[{
                    data: item
                }]
            });
        }
    });

    function load() {
        if (!isInit) {
            rmChart.setOption(option);
            isInit = true;
        }
    }

    return {
        load: load
    };
});
