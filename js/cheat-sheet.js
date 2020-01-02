var $chart = $('#cheat-chart');
var width = $chart.width();
var heightRatio = width > 400 ? 0.5 : 1.5;
var height = width * heightRatio;
var maxWidth = 848;
$chart.height(height);

var highlightFill = 'rgba(132, 181, 228, 0.5)';

var grid = {
    left: 60,
    top: 100,
    bottom: 70,
    right: 100
};
grid.width = width - grid.left - grid.right;
grid.height = height - grid.top - grid.bottom;

var xScale = grid.width / (maxWidth - grid.left - grid.right);
var yScale = grid.height / (maxWidth * heightRatio - grid.top - grid.bottom);

var chart;
var option;

var $detail = $('#cheat-detail');

var selectedRegion = null;
$(window).click(function (e) {
    // When click outside of chart or detail area, cancel selection
    if (e.target !== $('#cheat-chart canvas')[0]
        && $(e.target).closest($('#cheat-detail')).length < 1
    ) {
        selectedRegion = null;
        _doUnhighlight(option.graphic.elements, true);
        chart.setOption(option);
    }
});

var baseOption = {
    title: {
        text: '图表的标题',
        left: 5,
        top: 5
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
        silent: true,
        renderMode: 'richText'
    },
    toolbox: {
        right: 15,
        top: 5,
        feature: {
            dataView: {
                show: true,
                readOnly: false
            },
            magicType: {
                show: true,
                type: ['line', 'bar']
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    visualMap: {
        inRange: {
            symbolSize: [5, 20],
            color: ['#2F4554', '#C23431']
        },
        min: 0,
        max: 25,
        seriesIndex: 2,
        left: 80,
        top: 80,
        itemWidth: 20,
        itemHeight: 80,
        calculable: true
    },
    dataZoom: {
        type: 'slider',
        show: true,
        yAxisIndex: 1
    },
    legend: {
        data: ['蒸发量', '降水量', '平均温度'],
        top: 35,
        left: 5
    },
    grid: grid,
    xAxis: [{
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }],
    yAxis: [{
            type: 'value',
            name: '水量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
                formatter: '{value} ml'
            }
        },
        {
            type: 'value',
            name: '温度',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
                formatter: '{value} °C'
            }
        }
    ],
    series: [{
            name: '蒸发量',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            silent: true
        },
        {
            name: '降水量',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            silent: true
        },
        {
            name: '平均温度',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
            silent: true,
            symbol: 'circle',
            markPoint: {
                data: [{
                    coord: ['4月', 5],
                    value: '5℃'
                }]
            }
        }
    ],
    graphic: {
        elements: [{
            type: 'sector',
            position: [220, 140],
            shape: {
                r: 50,
                r0: 20,
                cx: 0,
                cy: 0,
                startAngle: 0,
                endAngle: Math.PI * 1.2
            },
            style: {
                fill: '#C23431'
            }
        }, {
            type: 'text',
            position: [210, 120],
            style: {
                text: '绘制图形和文字',
                fill: '#2F4554',
                font: '14px Arial'
            }
        }]
    },
    timeline: {
        data: [
            '2010', '2011', '2012', '2013', '2014', '2015', '2016'
        ],
        axisType: 'category',
        show: true,
        autoPlay: false
    }
};

var baseActions = [{
    type: 'showTip',
    seriesIndex: 0,
    dataIndex: 7,
    position: [width * 0.65, height * 0.45]
}];

var regions = [{
    left: grid.left,
    top: grid.top,
    width: grid.width,
    height: grid.height,
    option: {
        id: 'grid',
        desc: '直角坐标系内绘图区域'
    }
}, {
    group: (function () {
        var group = [];
        for (var i = 0; i < 12; ++i) {
            group.push({
                left: grid.left + grid.width / 12 * (i + 0.05),
                bottom: grid.bottom,
                width: grid.width / 12 * 0.9,
                height: grid.height / 25 * baseOption.series[2].data[i] + 10
            });
        }
        return group;
    })(),
    option: {
        id: 'series.itemStyle',
        desc: '系列的图形样式，对不同类型的图表有不同的意义。\n对折线图而言，这个配置项用于设置拐点处图形的样式；对柱状图而言，用于设置柱子的样式。该配置项是对整个系列的图形做设置，如果要对其中的某一个特定数据点做设置，应使用 <a href="option.html#series-line.data.itemStyle" target="_blank"><code>series.data.itemStyle</code></a>。'
    }
}, {
    left: 10,
    top: 5,
    width: 100,
    height: 24,
    option: {
        id: 'title',
        desc: '图表的标题'
    }
}, {
    left: 10,
    top: 35,
    width: 238,
    height: 24,
    option: {
        id: 'legend',
        desc: '图例，展现了不同系列的标记、颜色和名字'
    }
}, {
    right: 15,
    top: 5,
    width: 133,
    height: 29,
    option: {
        id: 'toolbox',
        desc: '工具栏，提供操作图表的工具，可自定义'
    }
}, {
    left: 5,
    top: grid.top - 35,
    width: 70,
    height: grid.height + 40,
    option: {
        id: 'yAxis',
        desc: '直角坐标系 grid 中的 y 轴'
    }
}, {
    left: grid.left - 3,
    top: grid.top,
    width: 6,
    height: grid.height,
    option: {
        id: 'yAxis.axisLine',
        desc: 'y 轴轴线'
    }
}, {
    left: grid.left + grid.width - 15,
    top: grid.top - 35,
    width: 60,
    height: grid.height + 40,
    option: {
        id: 'yAxis',
        desc: '直角坐标系 grid 中的 y 轴；第二个 y 轴默认显示在右边'
    }
}, {
    left: grid.width + grid.left - 3,
    top: grid.top,
    width: 6,
    height: grid.height,
    option: {
        id: 'yAxis.axisLine',
        desc: 'y 轴轴线'
    }
}, {
    group: [{
        left: grid.left + grid.width - 20,
        top: grid.top - 30,
        width: 40,
        height: 20
    }, {
        left: 38,
        top: grid.top - 30,
        width: 40,
        height: 20
    }],
    option: {
        id: 'yAxis.name',
        desc: 'y 轴名称，可以通过<code>nameLocation</code>改变位置'
    }
}, {
    group: (function () {
        var group = [];
        for (var i = 0; i < 6; ++i) {
            group.push({
                left: 11,
                top: grid.top + grid.height / 5 * i - 9,
                width: 42,
                height: 18
            });
        }
        for (var i = 0; i < 6; ++i) {
            group.push({
                left: grid.left + grid.width,
                top: grid.top + grid.height / 5 * i - 9,
                width: 42,
                height: 18
            });
        }
        return group;
    })(),
    option: {
        id: 'yAxis.axisLabel',
        desc: '坐标轴刻度标签'
    }
}, {
    group: (function () {
        var group = [];
        for (var i = 0; i < 5; ++i) {
            group.push({
                left: grid.left,
                top: grid.top + grid.height / 5 * i - 3,
                width: width - grid.left - grid.right,
                height: 6
            });
        }
        return group;
    })(),
    option: {
        id: 'yAxis.splitLine',
        desc: '坐标轴分割线，除此之外，还有 <code>splitArea</code> 设置背景色分割'
    }
}, {
    group: (function () {
        var group = [];
        for (var i = 0; i < 6; ++i) {
            group.push({
                left: 50,
                top: grid.top + grid.height / 5 * i - 5,
                width: 10,
                height: 10
            });
        }
        for (var i = 0; i < 6; ++i) {
            group.push({
                left: grid.left + grid.width,
                top: grid.top + grid.height / 5 * i - 5,
                width: 10,
                height: 10
            });
        }
        return group;
    })(),
    option: {
        id: 'yAxis.axisTick',
        desc: '坐标轴刻度'
    }
}, {
    left: grid.left,
    bottom: grid.bottom - 3,
    width: grid.width,
    height: 6,
    option: {
        id: 'xAxis',
        desc: '直角坐标系 grid 中的 x 轴'
    }
}, {
    left: grid.left,
    bottom: grid.bottom - 3,
    width: grid.width,
    height: 6,
    option: {
        id: 'xAxis.axisLine',
        desc: 'x 轴轴线'
    }
}, {
    group: (function () {
        var group = [];
        for (var i = 0; i < 12; ++i) {
            group.push({
                left: grid.left + grid.width * (i + 0.5) / 12 - 20 * xScale,
                bottom: grid.bottom - 25,
                width: 40 * xScale,
                height: 20
            });
        }
        return group;
    })(),
    option: {
        id: 'xAxis.axisLabel',
        desc: '坐标轴刻度标签'
    }
}, {
    group: (function () {
        var group = [];
        for (var i = 0; i < 13; ++i) {
            group.push({
                left: grid.left + grid.width * (i / 12) - 5,
                bottom: grid.bottom - 5,
                width: 10,
                height: 10
            });
        }
        return group;
    })(),
    option: {
        id: 'xAxis.axisTick',
        desc: '坐标轴刻度'
    }
}, {
    left: width * 0.65 - 5,
    top: height * 0.45 - 5,
    width: 118,
    height: 80,
    option: {
        id: 'tooltip',
        desc: '提示框'
    }
}, {
    left: grid.width / 12 * 7.5 + grid.left - 3,
    top: grid.top,
    width: 6,
    height: grid.height,
    option: {
        id: 'tooltip.axisPointer.lineStyle',
        desc: '提示框坐标轴指示器的线条样式'
    }
}, {
    left: grid.left,
    bottom: grid.height / 250 * 162.2 + grid.bottom - 4,
    width: grid.width,
    height: 6,
    option: {
        id: 'tooltip.axisPointer.crossStyle',
        desc: '提示框坐标轴指示器的十字线样式'
    }
}, {
    group: [{
        left: 5,
        bottom: grid.height / 250 * 162.2 + grid.bottom - 10,
        width: 50,
        height: 20
    }, {
        left: width - grid.right + 3,
        bottom: grid.height / 250 * 162.2 + grid.bottom - 10,
        width: 43,
        height: 20
    }, {
        left: grid.width / 12 * 7.5 + grid.left - 16,
        bottom: grid.bottom - 24,
        width: 32,
        height: 20
    }],
    option: {
        id: 'tooltip.axisPointer.label',
        desc: '提示框坐标轴指示器的文字'
    }
}, {
    left: baseOption.visualMap.left,
    top: baseOption.visualMap.top,
    width: 60,
    height: 110,
    option: {
        id: 'visualMap',
        desc: '视觉映射，可以将数据值映射到图形的形状、大小、颜色等。\n除了这个例子中连续型的视觉映射之外，还有<a href="option.html#series-line.data.itemStyle" target="_blank">离散型的视觉映射</a>。'
    }
}, {
    group: [{
        left: baseOption.visualMap.left + 20,
        top: baseOption.visualMap.top,
        width: 40,
        height: 20
    }, {
        left: baseOption.visualMap.left + 20,
        top: baseOption.visualMap.top + 90,
        width: 40,
        height: 20
    }],
    option: {
        id: 'visualMap.calculable',
        desc: '是否显示拖拽用的手柄（手柄能拖拽调整选中范围）'
    }
}, {
    right: 5,
    top: grid.top - 5,
    height: grid.height + 12,
    width: 34,
    option: {
        id: 'dataZoom',
        desc: '区域缩放，用来放大一部分的数据，以看清细节'
    }
}, {
    left: 160,
    top: 105,
    width: 150,
    height: 90,
    option: {
        id: 'graphic',
        desc: '绘制图形元素，包括：image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group 等'
    }
}, {
    left: 150,
    top: grid.top + grid.height + 20,
    width: grid.width - 120,
    height: 45,
    option: {
        id: 'timeline',
        desc: '多个 option 切换，展现不同时间段的数据'
    }
}, {
    left: grid.left + grid.width / 12 * 3,
    width: grid.width / 12,
    bottom: grid.bottom + grid.height / 5,
    height: 50,
    option: {
        id: 'series.markPoint',
        desc: '标记点。\n除此之外，还可以用 <code>markLine</code> 设置标记线，<code>markArea</code> 设置标记区域'
    }
}];

setSheet(baseOption, baseActions, regions);

function setSheet(baseOption, actions, regions) {
    getBaseChart(width, height, baseOption, actions, function (baseImage) {
        chart = echarts.init($chart[0]);

        option = {
            graphic: {
            }
        };

        var elements = [];

        var createRect = function (region, regionId, group) {
            return {
                type: 'rect',
                left: region.left,
                top: region.top,
                right: region.right,
                bottom: region.bottom,
                shape: {
                    width: region.width,
                    height: region.height
                },
                style: {
                    fill: 'transparent',
                    stroke: 'transparent'
                },
                onmouseover: function () {
                    highlight(chart, elements, regionId, option, group || region);
                },
                onmouseout: function () {
                    unhighlightAll(chart, elements, option);
                    if (selectedRegion) {
                        setDetailHtml(selectedRegion.option);
                    }
                },
                onclick: function (e) {
                    // Selecting region
                    if (selectedRegion) {
                        _doUnhighlight(elements, true);
                    }
                    selectedRegion = group || region;
                    highlight(chart, elements, regionId, option, group || region, true);
                    e.event.stopPropagation();
                }
            };
        };

        for (var i = 0; i < regions.length; ++i) {
            var shape;
            if (regions[i].group) {
                var group = regions[i].group;
                shape = {
                    type: 'group',
                    children: [],
                    width: '100%',
                    height: '100%'
                };
                for (var g = 0; g < group.length; ++g) {
                    var rect = createRect(group[g], i, regions[i]);
                    shape.children.push(rect);
                }
            }
            else {
                shape = createRect(regions[i], i);
            }
            elements.push(shape);
        }

        elements.push({
            type: 'image',
            style: {
                image: baseImage,
                width: width,
                height: height
            },
            silent: true,
            z: -1
        });

        option.graphic.elements = elements;

        chart.setOption(option);
    });
}

function getBaseChart(width, height, option, actions, callback) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var chart = echarts.init(canvas, null, {
        devicePixelRatio: 2
    });
    option.animation = false;
    option = {
        baseOption: option
    };
    chart.setOption(option);

    for (var i = 0; actions && i < actions.length; ++i) {
        chart.dispatchAction(actions[i]);
    }

    if (typeof callback === 'function') {
        setTimeout(function () {
            callback(canvas.toDataURL());
        }, 10);
    }
}

function highlight(chart, elements, highlightIndex, option, region, isSelect) {
    setDetailHtml(region.option);

    if (!isSelect) {
        _doUnhighlight(elements);
    }

    if (elements[highlightIndex].type === 'group') {
        var children = elements[highlightIndex].children;
        for (var i = 0; i < children.length; ++i) {
            if (isSelect) {
                children[i].style.stroke = '#24c';
            }
            else {
                children[i].style.fill = highlightFill;
            }
        }
    }
    else {
        if (isSelect) {
            elements[highlightIndex].style.stroke = '#24c';
        } else {
            elements[highlightIndex].style.fill = highlightFill;
        }
    }
    chart.setOption(option);
}

function unhighlightAll(chart, elements, option) {
    $detail.text('');
    _doUnhighlight(elements);
    chart.setOption(option);
}

function _doUnhighlight(elements, isSelect) {
    for (var i = 0; i < elements.length; ++i) {
        if (elements[i].type === 'rect') {
            elements[i].style.fill = 'transparent';
            if (isSelect) {
                elements[i].style.stroke = 'transparent';
            }
        }
        else if (elements[i].type === 'group') {
            var children = elements[i].children;
            for (var j = 0; j < children.length; ++j) {
                children[j].style.fill = 'transparent';
                if (isSelect) {
                    children[j].style.stroke = 'transparent';
                }
            }
        }
    }
}

function setDetailHtml(option) {
    var link = option.id;
    switch (link) {
        case 'series.itemStyle':
            link = 'series-line.itemStyle';
            break;

        case 'dataZoom.handleStyle':
            link = 'dataZoom-slider.handleStyle';
            break;

        case 'series.markPoint':
            link = 'series-line.markPoint';
            break;
    }

    var html = [
        '<h3>',
            option.id,
        '</h3>',
        '<p class="desc">点击图形固定说明文字</p>',
        '<p>',
            option.desc.split('\n').join('</p><p>'),
        '</p>',
        '<p>',
            '<a href="./option.html#' + link + '" target="_blank">',
                '查看配置项手册',
            '</a>',
        '</p>'
    ].join('');

    $detail.html(html);
}
