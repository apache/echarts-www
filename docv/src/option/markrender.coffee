define(
    (require) ->
        _ = require 'lodash'
        mark = require './mark_view'
        tip = require './tip'
        category = require './category'
        helper = require './helper'
        docUtil = require '../common/docUti'

        apiIndex = -1
        apiData = {}
        layout = null
        imgLayout = null
        markLayout = null
        categoryLayout = null

        exports = {}

        exports.init = (data) ->
            apiData = data


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


        exports.go = (index, hash) ->
            curCategory = apiData[apiIndex]?[0]

            if hash is curCategory
                return

            path = '../docv/data/api/'
            if index is -1
                index = _.findIndex apiData, (item) ->
                    item[0] is hash

            chartName = apiData[apiIndex = index][0]
            jsonFile = docUtil.addVersionArg(path + chartName + '.json')
            imgFile = docUtil.addVersionArg(path + chartName + '.png')

            imgLayout.attr({
                src: imgFile
            })

            category.hashRoute hash
            # clean layout marks
            markLayout.html('')

            $.getJSON(jsonFile, (data) ->
                marks = mark.render(data)

                tip.wrap marks

                $(marks).appendTo(markLayout)

            )

        exports.initCategory  = (ele) ->
            layout = $ ele
            imgLayout = layout.find('img.api-chart-img')
            markLayout = layout.find('div.marks-layout')
            categoryLayout = layout.find('div.api-category-list')

            tip.bindEvent(markLayout)

            category.init(categoryLayout, apiData)

        exports.initCategoryHash = () ->
            if !helper.getHashInfo().category
                category.hashRoute(apiData?[0]?[0] or '')

        exports
)
