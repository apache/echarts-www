var option = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        show: true,
        data: [
            {
                name:'蒸发量',
                textStyle:{
                    fontWeight:'normal',
                    color:'green',
                    fontSize: 18,
                    fontStyle: 'normal'
                }
            },
            '降水量'
        ],
        selectedMode: 'multiple',
        orient: 'horizontal',
        x: 50,
        y: 25,

        backgroundColor: '#eee',
        borderColor: '#ccc',
        borderWidth: 5,
        padding: [10, 60, 15, 20],

        itemGap: 20,
        itemWidth: 30,
        itemHeight: 20,
        selected: {
            '降水量': true
        },

        textStyle: {
            color: '#333',
            align: 'middle',
            baseline: 'bottom',
            fontSize: 20,
            fontStyle: 'italic',
            fontWeight: 'bold'
        },
        formmtter: null
    },
    toolbox: {
        show : true,
        color: ['#aaa','#aaa','#aaa','#aaa','#aaa','#aaa','#aaa','#aaa','#aaa','#aaa'],
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    grid: {
        y: 100
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis : [
        {
            type : 'value',
            splitArea : {show : true}
        }
    ],
    series : [
        {
            name:'蒸发量',
            type:'bar',
            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
            name:'降水量',
            type:'bar',
            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        }
    ]
}