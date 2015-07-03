define(
    (require) ->
        _ = require 'lodash'
        mark = require './mark_view'
#        tip = require './tip'

        exports = {}

        exports.init = (ele, data) ->
            imgPath = 'echarts-example/';

            $ele = $ ele
            $ele.find('img').attr({
                src: imgPath + data.fileName
                title: data.fileName
            });
            layout = $ele.find('div').html('')

            marks = mark.render(data.data)

            $(marks).appendTo(layout)

            # 模拟hover事件，增加一个500ms的debounce
            layout.on('mouseover', '.mark-item',
                _.debounce(
                    (event) ->
                        console.log event
#                        tip.render(event)
                    , 500
                )
            )

        exports
)