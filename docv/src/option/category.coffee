define(
    (require) ->
        exports = {}
        helper = require './helper'
        _ = require 'lodash'
        lang = require './lang'

        CLZ =
            SELECT: 'selected'
            LIST: 'api-category-list'

        SELECTOR =
            SELECT: '.' + CLZ.SELECT
            LIST: '.' + CLZ.LIST
            DATA: 'data-category'



        template = (list) ->
            "<ol>" +
            _.map(list, (item) ->
                "<li>
                    <a href='javascript:void(0)' #{SELECTOR.DATA}='#{item[0]}'>#{item[if lang.langCode is 'en' then 2 else 1]}</a>
                </li>"
            ).join('') + "</ol>"


        exports.init = (ele, list) ->
            ele = $ ele
            category = $(template(list)).appendTo(ele)
            me = @

            ele.on('click', 'a', (event) ->
                me.hashRoute($(@).attr('data-category'))
            )

        exports.hashRoute = (hash) ->
            $(SELECTOR.LIST).find(SELECTOR.SELECT).removeClass(CLZ.SELECT)
            $(SELECTOR.LIST).find("a[#{SELECTOR.DATA}=#{hash}]").parent('li').addClass(CLZ.SELECT)

            if helper.getHashInfo().category != hash
                helper.hashRoute({
                    category: hash
                })

        exports
)