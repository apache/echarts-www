var option = {
    title : {
        text: '双数值轴折线',
        subtext: '纯属虚构'
    },
    color: ['#ccc', '#ccc'],
    tooltip : {
        show: true,
        trigger: 'axis',
        showDelay: 0,
        axisPointer:{
            show: true,
            type : 'cross',
            crossStyle: {
                type : 'dashed',
                width : 10,
                color: '#777'
            }
        },
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderColor: 'rgba(200,200,200,0.4)',
        borderWidth: 7,
        borderRadius: 10,
        padding: 20,
        formatter : function (params) {
            return params.seriesName + ' : [ '
                + params.value[0] + ', '
                + params.value[1] + ' ]';
        },
        textStyle : {
            color: '#fff',
            align: 'center',
            fontSize: 20
        }
    },
    legend: {
        data:['数据1','数据2'],
        textStyle: {
            color: '#aaa'
        }
    },
    toolbox: {
        show : true,
        color: ['#aaa','#aaa','#aaa','#aaa','#aaa','#aaa','#aaa','#aaa','#aaa','#aaa'],
        feature : {
            mark : {show: true},
            dataZoom : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#ccc'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            }
        }
    ],
    yAxis : [
        {
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#ccc'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            }
        }
    ],
    series : [
        {
            name:'数据1',
            type:'line',
            data:[
                [1.5, 10], [5, 7], [8, 8], [12, 6], [11, 12], [16, 9], [14, 6], [17, 4], [19, 9]
            ]
            // markPoint : {
            //     data : [
            //         // 纵轴，默认
            //         {type : 'max', name: '最大值',symbol: 'emptyCircle', itemStyle:{normal:{color:'#dc143c',label:{position:'top'}}}},
            //         {type : 'min', name: '最小值',symbol: 'emptyCircle', itemStyle:{normal:{color:'#dc143c',label:{position:'bottom'}}}},
            //         // 横轴
            //         {type : 'max', name: '最大值', valueIndex: 0, symbol: 'emptyCircle', itemStyle:{normal:{color:'#1e90ff',label:{position:'right'}}}},
            //         {type : 'min', name: '最小值', valueIndex: 0, symbol: 'emptyCircle', itemStyle:{normal:{color:'#1e90ff',label:{position:'left'}}}}
            //     ]
            // },
            // markLine : {
            //     data : [
            //         // 纵轴，默认
            //         {type : 'max', name: '最大值', },
            //         {type : 'min', name: '最小值', itemStyle:{normal:{color:'#dc143c'}}},
            //         {type : 'average', name : '平均值', itemStyle:{normal:{color:'#dc143c'}}},
            //         // 横轴
            //         {type : 'max', name: '最大值', valueIndex: 0, itemStyle:{normal:{color:'#1e90ff'}}},
            //         {type : 'min', name: '最小值', valueIndex: 0, itemStyle:{normal:{color:'#1e90ff'}}},
            //         {type : 'average', name : '平均值', valueIndex: 0, itemStyle:{normal:{color:'#1e90ff'}}}
            //     ]
            // }
        },
        {
            name:'数据2',
            type:'line',
            data:[
                [1, 2], [2, 3], [4, 2], [7, 5], [11, 2], [18, 3]
            ]
        }
    ]
};