define(
    (require) ->
        _ = require 'lodash'
        mark = require './mark_view'
#        tip = require './tip'

        apiIndex = 0
        apiData = []
        layoutEle = null

        exports = {}

        exports.init = (ele) ->
            layoutEle = $ ele

            apiData = JSON.parse require('tpl!../../data/api/index.json')

            # 模拟hover事件，增加一个500ms的debounce
            layoutEle.find('div').on('mouseover', '.mark-item',
                _.debounce(
                    (event) ->
                        console.log event
#                        tip.render(event)
                    , 500
                )
            )

            @go(0)


        exports.prev = () ->
            prevIndex = apiIndex - 1
            if prevIndex < 0
                if apiData.length > 0
                    prevIndex = apiData.length - 1
                else
                    prevIndex = 0

            @go(prevIndex)


        exports.next = () ->
            nextIndex = apiIndex + 1
            nextIndex = 0 if nextIndex > apiData.length - 1

            @go(nextIndex)


        exports.go = (index) ->
            imgPath = '/docv/data/api/'

            chartName = apiData[apiIndex = index]

            $.getJSON(imgPath + chartName + '.json', (data) ->

                layoutEle?.find('img').attr({
                    src: imgPath + chartName + '.png'
                })

                # clean layout marks
                layout = layoutEle.find('div').html('')

                marks = mark.render(data)

                $(marks).appendTo(layout)
            )


        exports
)
