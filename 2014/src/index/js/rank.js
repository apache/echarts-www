define(function(require) {
    
    var echarts = require('echarts');
    var line = require('echarts/chart/line');
    var timeData = require('../../data/rank').timeData;
    var rankData = require('../../data/rank').rankData;
    var teamInfo = require('../../data/teamInfo');
    var colorMap = require('../../data/colorJson');
    var circleFlagData =require('../../data/circle_flag');

    var dataTeam;
    var instance;
    
    function init() {
        instance = echarts.init(document.getElementById('rankChart'));
        
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: timeData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '历史排名'
                }
            ],
            grid: {
                x: 40,
                y: 30,
                x2: 20,
                y2: 30
            }
        };

        instance.setOption(option);
    }

    function load() {
        !instance && init();

        require('./filter').load();
    }

    function repaintChart(teams) {
        !instance && init();

        dataTeam = teams;
        
        var data = processData(teams);

        var series = [];
        var teams = teams || [];
        $.each(teams, function(index, item) {
            series.push({
                name: item,
                type: 'line',
                symbol: 'image://' + circleFlagData[item],
                symbolSize: 4,
                data: data[item],
                itemStyle: {
                    normal: {
                        color: colorMap[item]
                        //lineStyle: {
                        //    shadowColor: 'rgba(0, 0, 0, 0.4)',
                        //    shadowBlur: 5,
                        //    shadowOffsetX: 3,
                        //    shadowOffsetY: 3
                        //}
                    }
                }
            });
        });

        instance.setOption({
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: function(value) {
                            return (80 - value);
                        }
                    }
                }
            ],
            tooltip: {
                trigger: 'axis',
                formatter: function(arr) {
                    var str = arr[0][1] + '<br/>';

                    if (arr.length < 5) {
                        $.each(arr, function(index, item) {
                            str += item[0] + ':' + (80 - item[2]) + '<br/>'
                        });
                    }
                    else {
                        $.each(arr, function(index, item) {
                            str += item[0] + ':' + (80 - item[2]) +((index + 1) % 3 == 0 ? '<br/>' : ' ');
                        });
                    }

                    return str;
                }
            }
        });

        instance.setSeries(series, true);
    }

    function processData(teams) {
        var data = {};
        var max = 80;
        //$.each(teams, function(index, item) {
        //    $.each(rankData[item], function(i, num) {
        //        if (parseInt(num, 10) > max) {
        //            max = parseInt(num, 10);
        //        }
        //    });
        //});

        var arr = [5, 10, 15, 20, 25, 30, 35, 40, 45];
        $.each(teams, function(index, item) {
            data[item] = [];
            $.each(rankData[item], function(i, num) {
                data[item][i] = max - num;
            });


            var x = 3;

            data[item][arr[x]] = {
                value: data[item][arr[x]],
                symbol: circleFlagData[item],
                symbolSize: 10
            };
        });

        return data;
    }

    return {
        load: load,
        repaintChart: repaintChart
    };
});
