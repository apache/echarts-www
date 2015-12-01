_fs = require('fs')
_path = require('path')

Array2D = require('../common/Array2D')
DATA = require('./data')
util = require('./JoinUtil')

outputPath = _path.resolve(__dirname, './gapminder.json.js')

countries = ['Country', 'China', 'United States', 'United Kingdom', 'Russia',
             'India', 'France', 'Germany', 'Australia', 'Canada', 'Cuba', 'Finland',
             'Iceland', 'Japan', 'North Korea',
             'South Korea', 'New Zealand', 'Norway', 'Poland', 'Turkey']

# 转换为二维数组,用于 innerJoin 操作
countriesTran = countries.map((item) ->
    [item]
)

# 转换为二维数组,用于 innerJoin 操作
timeline = DATA.population[0].slice()
timelineTran = timeline.map((item) ->
    [item]
)

###
    过滤原始数据, 根据国家名以及时间过滤
###
filterOriginData = (data) ->
    # 过滤国家
    tempArr = util.innerJoin(data, countriesTran)

    # 行列转置
    tempArr = Array2D.transpose(tempArr)

    # 过滤年代
    tempArr = util.innerJoin(tempArr, timelineTran)

    Array2D.transpose(tempArr)

# 收入
incomeArr = filterOriginData(DATA.incomes)

# 平均寿命
lifeExpectancyArr = filterOriginData(DATA.lifeExpectancy)

# 人口
populationArr = filterOriginData(DATA.population)

# scatterData = [
#     [   # 1900
#         ['income', 'lifeExpectancy', 'countryName'],
#         []
#     ],
#     [
#         # 1905
#         ['income', 'lifeExpectancy', 'countryName'],
#         []
#     ]
# ]

scatterData = [];

Array2D.eachRow(incomeArr, (row, rIndex) ->
    # 第一行为表头, 不取
    if rIndex > 0
        # 遍历到一行(一个国家)
        row.forEach((cell, i) ->
            # 第一列为国家名,不放在第一位
            if i > 0
                x = i - 1
                y = rIndex - 1
                # 创建二维数组
                scatterData[x] ?= []
                scatterData[x][y] ?= []

                # 压入第一个数据, 作为气泡图的X轴
                item = scatterData[x][y]
                item.push cell
                # 平均寿命
                item.push lifeExpectancyArr[rIndex][i]
                # 人口
                item.push populationArr[rIndex][i]
                # 国家名
                item.push row[0]
                # 年代
                item.push incomeArr[0][i]
        )
)

output = {
    counties: countries.slice(1),
    timeline: timeline.slice(1),
    series: scatterData
}

defineWrapper = (json) ->
    jsonString = JSON.stringify json
    'define(' + jsonString + ');'

_fs.writeFile(outputPath, defineWrapper output, (error) ->
    if error
        console.log error
    else
        console.log 'OK!'
)

