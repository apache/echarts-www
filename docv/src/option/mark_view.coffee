define((require) ->
    _ = require 'lodash'
    require 'jqueryui'

    markTemplate = (mark) ->
        "<div class='mark-item #{mark.type}'
                #{CONST.DATA_KEY}='#{JSON.stringify(mark.data)}'
                #{CONST.SIZE_KEY}='#{mark.size.width},#{mark.size.height}'
                style='#{mark.style}'>
         </div>"

    CONST =
        DATA_KEY: 'data-mark'
        SIZE_KEY: 'data-size'
        TYPE_REG: /\s*(icon-arrow-[\w\-]+)\s*/i
        SELECTOR: '.mark-item'
        TITLE: ''

    $.widget('mark.mark', {
        _create: () ->
            @ele = $ @element

        getData: () ->
            JSON.parse(@ele.attr(CONST.DATA_KEY) || {})

        getType: () ->
            @ele.attr('class').match(CONST.TYPE_REG)?[1]

        toJSON: (unit = 'precent') ->
            size = @getSize()
            {width, height} = size

            [style, data, type] =
                [
                    @ele.attr('style')
                    @getData()
                    @getType()
                ]

            style = style.replace(/rgb\((.+)\)/i, () ->
                hex = '#'
                [r, g, b] = arguments[1].split(',')

                # eg: rgb(0, 255, 1) => #00ff01
                hex += _.padLeft(parseInt(dec, 10).toString(16), 2, 0) for dec in [r, g, b]

                hex
            )

            if unit is 'precent'
                style = style.replace(/top:(\s*\d+)px;/i, () ->
                    top = _.round arguments[1] / height * 100, 2
                    "top: #{top}%;"
                )

                style = style.replace(/left:(\s*\d+)px;/i, () ->
                    left = _.round arguments[1] / width * 100, 2
                    "left: #{left}%;"
                )

            { style, data, type, size }

    })


    class MarkFactory

        constructor: (@options) ->
            @markList = []

        # 根据数据，反绘标记点
        render: (marks) ->
            html = _.map(marks, (mark) ->
                markTemplate mark
            ).join('')

            widgets = $(html).mark()

            @markList = widgets


        remove: (mark) ->
            _.remove @markList, mark
            $(mark).mark('destroy')

        getMark: () ->
            @markList


    new MarkFactory()
)