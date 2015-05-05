define(function(require) {

    var isInit = false;
    var instance;
    
    var indexData = require('../../data/history').indexData;
    var recordData = require('../../data/history').recordData;
    var circleFlagData = require('../../data/circle_flag');
    var echarts = require('echarts');
    require('echarts/chart/scatter');

    var indexArray = ['参赛届数', '胜率', '平均每场进球数'];

    function init() {
        bindEvents();

        instance = echarts.init(document.getElementById('historyChart'));
        
        var option = {
            title: {
                text: '历史战绩'
            },
            tooltip: {
                formatter: function(args) {
                    var val = args[2];
                    var str = args[1];
                    str += '<br>' + indexArray[0] + ':' + val[0];
                    if (indexArray[1] === '胜率' || indexArray[1] === '不败率') {
                        str += '<br>' + indexArray[1] + ':' + val[1] + '%';
                    }
                    else {
                        str += '<br>' + indexArray[1] + ':' + val[1];
                    }
                    str += '<br>' + indexArray[2] + ':' + val[2];

                    return str;
                }
            },
            xAxis : [
                {
                    type : 'value'
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    scale: true,
                    splitArea : {show : true}
                }
            ],
            grid: {
                x: 40,
                y: 30,
                x2: 20,
                y2: 35
            },
            series: [processData(['参赛届数', '胜率', '平均每场进球数'])]
        };

        instance.setOption(option);
        handleOption(['参赛届数', '胜率', '平均每场进球数']);
    }

    function processData(indexArr) {
        indexArray = indexArr;

        var res = {
            type: 'scatter',
            data: []
        };

        var sum = 0;

        $.each(recordData, function(name, item) {
            var obj = {
                name: name,
                symbol: circleFlagData[name],
                value: []
            };
            $.each(indexArr, function(i, index) {
                obj.value[i] = item[$.inArray(index, indexData)];
            })

            sum += (item[$.inArray(indexArr[2], indexData)] - 0);

            res.data.push(obj);
        });

        var avg = sum / 32;
        res.symbolSize = function(val) {
            var size = 20 * (val[2] / avg);

            size = size > 10 ? size : 10;

            size = size > 40 ? 40 : size;

            return size;
        };

        return res;
    }

    function bindEvents() {
        $('.filter4-wrap').click(function(e) {
            var target = e.target;
            var tagName = target.tagName.toUpperCase();

            if (tagName === 'LI') {
                $(target).parent().children('li').removeClass('selected');
                $(target).addClass('selected');
            }

            var indexArr = [];
            $.each($('.filter4-wrap .selected'), function(i, item) {
                indexArr.push($(item).html());
            });

            instance.setSeries([processData(indexArr)], true);
            handleOption(indexArr);
        });
    }

    function handleOption(indexArr) {
        if (indexArr[1] === '胜率' || indexArr[1] === '不败率') {
            instance.setOption({
                yAxis: [
                    {
                        type : 'value',
                        scale: true,
                        splitArea : {show : true},
                        axisLabel: {
                            formatter: function(val) {
                                return (val + '%');
                            }
                        }
                    }
                ]
            });
        }
        else {
            instance.setOption({
                yAxis: [
                    {
                        type : 'value',
                        scale: true,
                        splitArea : {show : true},
                        axisLabel: {
                            formatter: function(val) {
                                return val;
                            }
                        }
                    }
                ]
            });
        }
    }

    function load() {
        if (!isInit) {
            init();
            isInit = true;
        }
    }

    return {
        load: load
    };
});
