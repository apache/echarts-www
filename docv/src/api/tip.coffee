define(
    (require) ->

        _ = require 'lodash'
        helper = require './helper'

        CLZ =
            LOCK: 'popover-lock'
            ITEM: '.mark-item'
            POP: '.popover'

        HIDE_DELAY = 200
        DATA_TIMER = 'timer'

        templateContent = (data) ->
            "<div class='popover' role='tooltip'>
                <div class='arrow'></div>
                <div class='title-bar clearfix'>
                    <h3 class='popover-title'></h3>
                    <span class='#{CLZ.LOCK} icon-lock-open '></span>
                </div>
                <div class='popover-list clearfix'>
                    #{listTemplate(data.list)}
                </div>
            </div>"

        listTemplate = (list) ->
            if list.length
                "<div>" +
                _.map(list, (item) ->
                    "<a class='list-item' href='javascript:void(0)' data-query=#{item.query}>#{item.desc}</a>"
                ).join('') + "</div>"
            else
                ''

        exports = {}

        exports.wrap = (eles) ->

            _.each(eles, (ele) ->
                data = $(ele).mark('getData')

                $(ele).popover({
                    'toggle': 'popover'
                    'placement': 'bottom'
                    'title': data.title
                    'trigger': 'manual'
                    'animation': false
                    template: templateContent(data)
                })

            )

        exports.bindEvent = (layout) ->
            layout = $ layout

            layout.on('mouseenter', CLZ.ITEM,
                (event) ->
                    item = $ @
                    timer = item.data(DATA_TIMER)
                    if !timer
                        item.popover('show')
                    else
                        clearTimeout(timer) && item.removeData(DATA_TIMER)

            )

            layout.on('mouseleave', CLZ.ITEM, (event) ->
                item = $ @
                timer = setTimeout(() ->
                    item.popover('hide') if !item.data(CLZ.LOCK)
                    item.removeData(DATA_TIMER)
                , HIDE_DELAY)
                item.data(DATA_TIMER, timer)
            )

            layout.on('mouseenter', CLZ.POP, (event) ->
                self = $ @
                item = self.prev(CLZ.ITEM)
                clearTimeout(item.data(DATA_TIMER)) && item.removeData(DATA_TIMER)
#                item.popover('show')
            )

            layout.on('mouseleave', CLZ.POP, (event) ->
                self = $ @
                item = self.prev(CLZ.ITEM)
                timer = setTimeout(() ->
                    item.popover('hide') if !item.data(CLZ.LOCK)
                    item.removeData(DATA_TIMER)
                , HIDE_DELAY)
                item.data(DATA_TIMER, timer)
            )

            layout.on('click', '.' + CLZ.LOCK, (event) ->
                self = $ @
                self.toggleClass('icon-lock-open icon-lock-closed')
                item = self.parents(CLZ.POP).prev(CLZ.ITEM)
                item.data(CLZ.LOCK, !!self.hasClass('icon-lock-closed'))
            )

            layout.on('click', '.popover-list a', (event) ->
                self = $ @

                helper.hashRoute({
                    queryString: self.attr('data-query') or ''
                })
            )


        exports
)






















