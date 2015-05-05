define(function(require) {

    var instance;
    var echarts = require('echarts');
    var name2index = require('../../data/playerInfo').name2index;
    var playerData = require('../../data/playerInfo').data;
    var nameData = require('../../data/playerInfo').nameArr;
    require('echarts/chart/chord');

    function init() {
        instance = echarts.init(document.getElementById('playerChart'));

        var option = {
            title: {
                text: '效力联赛分布',
                x: 'right',
                y: 'bottom'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(val) {
                    var str = val[1];

                    if (val[3]) {
                        str += ' -> ' + val[3];
                    }

                    str += ' : '
                    str += val[2];
                    str += '人';

                    return str;
                }
            }
        };
        
        instance.setOption(option);
    }

    function load() {
        !instance && init();

        require('./filter1').load();
    }

    function repaintChart(countrys) {
        !instance && init();
        
        if (!countrys.length) {
            instance.clear();
            instance = null;

            return ;
        }

        var data = [];
        $.each(countrys, function(index, item) {
            data.push({
                name: item
            });
        });

        var clubArr = [];

        var len = data.length;
        $.each(data, function(index, item) {
            $.each(playerData[item.name], function(i, count) {
                if (count > 0 && ($.inArray(nameData[i], clubArr) < 0)) {
                    clubArr.unshift(nameData[i]);
                }
            });
        });

        var clubCount = {};

        $.each(clubArr, function(index, item) {
            clubCount[item] = clubCount[item] || 0;
            
            $.each(countrys, function(i, name) {
                clubCount[item] += playerData[name][name2index[item]];
            });
        });

        var len = clubArr.length;
        var clubArr = [];
        var clubArrNum = [];
        for (var i = 0; i < len; i++) {
            var max = 0;
            var maxIndex;
            $.each(clubCount, function(index, item) {
                if (item > max) {
                    max = item;
                    maxIndex = index;
                }
            });

            clubArr.push(maxIndex);
            clubArrNum.push(max);
            delete clubCount[maxIndex];
        }


        var otherArr = [];

        if (clubArr.length > 10) {
            for (var i = 10; i < clubArr.length; i++) {
                $.each(countrys, function(index, item) {
                    otherArr[item] =  otherArr[item] || 0;
                    otherArr[item] += playerData[item][name2index[clubArr[i]]];
                });
            }
            clubArr = clubArr.slice(0, 10);
            clubArr.push('其它');
        }

        clubArr = clubArr.reverse();
        $.each(clubArr, function(index, item) {
            data.push({
                name: item + '联赛'
            });
        });

        var matrix = [];
        $.each(countrys, function(index, item) {
            var arr = [];

            $.each(countrys, function() {
                arr.push(0);
            });

            $.each(clubArr, function(i, name) {
                if (name == '其它') {
                    arr.push(otherArr[item]);
                }
                else {
                    arr.push(playerData[item][name2index[name]]);
                }
            });

            matrix.push(arr);
        });

        $.each(clubArr, function(index, item) {
            var arr = [];

            $.each(countrys, function(i, name) {
                if (item == '其它') {
                    arr.push(otherArr[name]);
                }
                else {
                    arr.push(playerData[name][name2index[item]]);
                }
            });

            $.each(clubArr, function() {
                arr.push(0);
            });

            matrix.push(arr);
        });

        var series = [
            {
                type: 'chord',
                sort: 'none',
                sortSub: 'none',
                showScaleText: false,
                itemStyle : {
                    normal : {
                        label : {
                            show : true,
                            rotate: true,
                            distance: 3
                        }
                    }
                },
                data: data,
                matrix: matrix
            }
        ];

        instance.setSeries(series, true);
    }

    return {
        load: load,
        repaintChart: repaintChart
    };
});
