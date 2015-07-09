define(
    (require) ->
        exports = {}
        helper = require './helper'
        _ = require 'lodash'

        template = (list) ->
            "<ol>" +
            _.map(list, (item) ->
                "<li>
                    <a href='javascript:void(0)' data-category='#{item[0]}'>#{item[1]}</a>
                </li>"
            ).join('') + "</ol>"

        exports.init = (ele, list) ->
            ele = $ ele
            category = $(template(list)).appendTo(ele)

            ele.on('click', 'a', (event) ->
                helper.hashRoute({
                    category: $(@).attr('data-category')
                })
            )

        exports
)