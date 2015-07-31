define((require) ->
    _ = require 'lodash'
    oneColor = require 'onecolor'
    require 'jqueryui'

    markTemplate = (mark) ->
        "<div class='mark-item #{mark.type}'
                #{CONST.DATA_KEY}='#{JSON.stringify(mark.data)}'
                #{CONST.SIZE_KEY}='#{mark.size}'
                style='top: #{mark.style.y};
                     left: #{mark.style.x};
                     z-index: #{mark.style.z};
                     color: #{mark.style.color};' >
         </div>"

    MARK_DEF =
        markWidth: 16
        markHeight: 16
        color: '#000000'
        type: 'icon-arrow-up-left'
        z: 10

    CONST =
        DATA_KEY: 'data-mark'
        SIZE_KEY: 'data-size'
        TYPE_REG: /\s*(icon-arrow-[\w\-]+)\s*/i
        SELECTOR: '.mark-item'

    $.widget('mark.mark', {
        _create: () ->
            @ele = $ @element

#        _destroy: () ->
#            @ele.remove()

        getData: () ->
            JSON.parse(@ele.attr(CONST.DATA_KEY) || {})

        setData: (data) ->
            @ele.attr(CONST.DATA_KEY, JSON.stringify(data))

        setType: (type) ->
            curType = @getType()
            if curType
                @ele.removeClass(curType)
            @ele.addClass(type)

        getType: () ->
            @ele.attr('class').match(CONST.TYPE_REG)?[1]

        getSize: () ->
            [width, height] = @ele.attr(CONST.SIZE_KEY).split(',')

        # 获取Mark上的样式
        # @param {string=} styleName 样式名，可选，不传Name时，默认返回全部Key/Value组
        # @return {Object|string}
        getStyles: (styleName) ->
            styleObj = {}

            for style in @ele.attr('style').split(';') when _.trim(style).length > 0
                [key, value] = style.split(':')
                styleObj[_.trim key] = _.trim value

            res = if styleName then styleObj[styleName] else styleObj

        setStyle: (styleName, value) ->
            @ele.css(styleName, value)

        toJSON: (unit = 'percent') ->
            size = @getSize()
            styles = @getStyles()

            [width, height] = size

            styleObj = {
                x: styles.left
                y: styles.top
                z: styles['z-index']
            }

            # RGB to HEX
            styleObj.color = oneColor(styles.color).hex()

            if unit is 'percent'
                # Convert px to %
                if styles.top.indexOf('px') isnt -1
                    top = styles.top.replace('px', '')
                    styleObj.y = _.round(top / height * 100, 2) + '%'
                if styles.left.indexOf('px') isnt -1
                    left = styles.left.replace('px', '')
                    styleObj.x = _.round(left / width * 100, 2) + '%'

            [style, data, type, size] =
                [
                    styleObj
                    @getData()
                    @getType()
                    size.join(',')
                ]

            {style, data, type, size}
    })


    class MarkFactory

        constructor: (@options) ->
            @markList = []

        setOption: (options) ->
            MARK_DEF = _.merge(MARK_DEF, options)

#            @_measureIconSize @options.markLegend

#        _measureIconSize: (icon) ->
#            $icon = $ icon
#            [height, width] = [$icon.height(), $icon.width()]
#
#            {height, width}

        # 创建Mark的Widget实例。（但不负责绘制到UI上，交给画板绘制）
        create: (params) ->
            {x, y, width, height, color, type} = _.merge(MARK_DEF, params)

            [x, y, z] =
                [
                    (x - MARK_DEF.markWidth / 2) + 'px'
                    (y - MARK_DEF.markHeight / 2) + 'px'
                    MARK_DEF.z++
                ]

            data = {
                style: {x, y, z, color}

                data:
                    # title
                    t: ''
                    # list
                    l: []

                type

                size: [width, height].join(',')
            }

            widget = $(markTemplate(data)).mark()

            @markList.push widget

            widget

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

        clearMark: () ->
            _.each(@markList, (mark) ->
                $(mark).mark('destroy')
            )
            @markList = []


    new MarkFactory()
)