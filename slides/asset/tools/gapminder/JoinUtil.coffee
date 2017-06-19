Array2D = require('../common/Array2D')
_ = require('../common/lodash')

ASSERT_TYPE =
    TYPE: 'TYPE'
    RANGE: 'RANGE'

OPT_CONFIG =
    RESERVE_ALL: 'all'
    RESERVE_LEFT: 'left'
    RESERVE_RIGHT: 'right'

assert = (message, type = '') ->
    switch type.toUpperCase()
        when ASSERT_TYPE.TYPE then throw TypeError(message)
        when ASSERT_TYPE.RANGE then throw RangeError(message)
        else throw Error(message)

utils =
    ###
        Inner-join
        @param {Array<array>} tableOne 2D-Array
        @param {Array<array>} tableTwo 2D-Array
        @param {number} tableOneCol index column of Join-key. optional, default: 0
        @param {number} tableOneCol index column of Join-key. optional, default: 0
        @param {Object} options
        @option {string} witch table should be reserved
    ###
    innerJoin: (tableOne, tableTwo, tableOneCol = 0, tableTwoCol = 0, options = {
        reserve: OPT_CONFIG.RESERVE_LEFT
    }) ->
        if !Array2D.check tableOne || !Array2D.check tableTwo
            assert('Type error!', ASSERT_TYPE.TYPE)

        colOne = Array2D.column(tableOne, tableOneCol)
        colTwo = Array2D.column(tableTwo, tableTwoCol)

        # Pick column title
        colOneHead = colOne[0]
        colTowHead = colTwo[0]

        # Same value in new column
        sharedCol = _.intersection(colOne.slice(1), colTwo.slice(1))

        # Which tables can be join together
        combineTable = []
        switch options.reserve
#            when OPT_CONFIG.RESERVE_ALL then combineTable = [tableOne, tableTwo]; column = [tableOneCol, tableTwoCol]
            when OPT_CONFIG.RESERVE_LEFT then combineTable = [tableOne]; column = tableOneCol
            when OPT_CONFIG.RESERVE_RIGHT then combineTable = [tableTwo]; column = tableTwoCol

        joinTable = []

        combineTable.forEach((table) ->
            Array2D.eachRow(table, (row, rIndex) ->
                # Exclude table head
                if rIndex != 0
                    if sharedCol.indexOf(row[column]) > -1
                        joinTable.push row
                else
                    joinTable.push row
            )
        )

        joinTable


module.exports = utils