/**
 * @file js data
 * @author sushuang(sushuang@baidu.com)
 */
define(function (require) {

    var dtLib = require('dt/lib');
    var helper = require('./helper');
    var constant = require('./constant');

    /**
     * [Usage]
     *
     * Create:
     * var jsDataOb = jsDataFactory.create();
     *
     * Get and set data:
     * var data = jsDataOb();
     * jsDataOb(someNewData);
     *
     * Get and set dimColStep:
     * jsDataOb.dimColStep(4);
     * var dimColStep = jsDataOb.getDimColStep();
     *
     * Subscribe:
     * jsDataOb.subscribe(function(newValue, jsDataOb) {
     *     // ...
     * });
     */

    /**
     * [Types]
     *
     * constant.JSDATA_DIM_ARRAY:
     * [
     *     [[12, 32], [54, 64], [1212, 22]], // Each row coresponds to an text input。
     *     [[434, 'sdfa'], [2, 23]], // two-dimension. Inner item must be Array (must not be null or undefined).
     *     [12, 442, 'asdf', '-']    // one-dimension
     * ]
     *
     * constant.JSDATA_ARRAY_OBJECT:
     * [
     *     [
     *         {name: 'aa', value: 1212}, // Each item must be Object (must not be null or undefined).
     *         {name: 'aa', value: 1212},
     *         {name: 'aa', value: 1212},
     *         {name: 'aa', value: 1212}
     *     ]
     * ]
     */

    /**
     * [Empty Value Representation]
     *
     * Empty value in jsDataOb is specified by jsDataOb.getEmptyValue.
     * Empty value in dataTable (handsontable) is null.
     */

    var jsDataFactory = {};

    jsDataFactory.create = function () {
        var ob = dtLib.ob();
        dtLib.assign(ob, methods);

        ob._dataMeta = {};
        ob.setType(constant.JSDATA_DIM_ARRAY, null, true); // init

        return ob;
    };

    var methods = [];

    /**
     * @public
     * @return {string} type
     */
    methods.getType = function (type, dataMeta, isSilent) {
        return this._type;
    };

    /**
     * @public
     * @param {string} type 值可为：constant.JSDATA_DIM_ARRAY, constant.JSDATA_ARRAY_OBJECT
     * @param {Object=} dataMeta For merge.
     * @param {boolean=} isSilent 默认false
     * @return {Object} jsDataOb
     */
    methods.setType = function (type, dataMeta, isSilent) {
        this._type = type;
        setDataMeta.call(this, dataMeta);
        // Clear data and trigger subscription.
        !isSilent && this([]);
        return this;
    };

    /**
     * @param {Object=} dataMeta
     * @param {number=} [dataMeta.emptyValue] 什么东西表示数据项的“空”。默认是'-'，还可以设成null。
     * @param {number=} [dataMeta.dimColStep]
     * @param {string=} [dataMeta.itemDataType] 值为：'string', 'number', 'auto'
     *                                          （默认，即尽量为number，否则为string）
     * @param {Array.<Object>} [dataMeta.propertyMetas] constant.JSDATA_ARRAY_OBJECT 时有效
     *                                                   Array每项值为 {
     *                                                       itemDataType: 取值值同上,
     *                                                       propertyName: string
     *                                                   }
     * @inner
     */
    function setDataMeta(inputDataMeta) {
        var dataMeta = this._dataMeta;

        if (dataMeta != null) {
            dtLib.merge(dataMeta, inputDataMeta, {clone: true});
        }

        // Some default settings.
        if (!dataMeta.propertyMetas) {
            dataMeta.propertyMetas = [];
        }
        if (!dataMeta.itemDataType) {
            dataMeta.itemDataType = 'auto';
        }
        if (!dataMeta.hasOwnProperty('emptyValue')) {
            dataMeta.emptyValue = '-';
        }
    }

    /**
     * @public
     */
    methods.getEmptyValue = function (value) {
        return this._dataMeta.emptyValue;
    };

    /**
     * @public
     */
    methods.setEmptyValue = function (value) {
        this._dataMeta.emptyValue = value;
    };

    /**
     * 设置或得到二维数组的内层宽度定义。
     * 这种设计是为了方便“多系列”的一起处理。
     * （多系列一起贴进excel，直接输出结果）
     *
     * dimColStep的意义是，假设excel中有数据:
     * 6  5  4  3  2
     * 16 15 14 13 12
     *
     * 如果dimColStep是3，
     * 则从excel得到的jsData结构为：
     * [
     *     [[6, 5, 4], [16, 15, 14]],
     *     [[3, 2], [13, 12]]
     * ]
     *
     * 如果dimColStep是null或undefined，
     * 则从excel得到的jsData结构为（降一维）：
     * [
     *     [6, 16],
     *     [5, 15],
     *     [4, 14],
     *     [3, 13],
     *     [2, 12]
     * ]
     *
     * 如果dimColStep是'max'，表示无限大，
     * 则从excel得到的jsData结构为：
     * [
     *     [[6, 5, 4, 3, 2], [16, 15, 14, 13, 12]]
     * ]
     *
     * 以上是type为constant.JSDATA_DIM_ARRAY的例子，type为constant.JSDATA_ARRAY_OBJECT时同理。
     *
     * @public
     * @return {number} value
     */
    methods.getDimColStep = function () {
        return this._dataMeta.dimColStep;
    };

    /**
     * @public
     * @param {(number|string)=} value 传值则表示设置。
     * @return {Object} jsDataOb
     */
    methods.setDimColStep = function (value) {
        this._dataMeta.dimColStep = value;
        return this;
    };

    /**
     * itemDataType: 'string', 'number', 'auto'（默认。能转成number则为number，否则为string）
     *
     * @public
     */
    methods.getItemDataType = function () {
        return this._dataMeta.itemDataType;
    };

    /**
     * @public
     */
    methods.setItemDataType = function (value) {
        this._dataMeta.itemDataType = value;
    };

    /**
     * @public
     * @param  {number} dataTableColCount
     * @return {Object} {count: ..., colStep: ..., seriesDim: ...}
     */
    methods.getSeriesInfo = function (dataTableColCount) {
        if (arguments.length === 0) {
            dataTableColCount = this.getColCount();
        }
        var dimColStep = this.getDimColStep();
        var count;
        var colStep;
        if (dimColStep === 'max') {
            count = 1;
            colStep = dataTableColCount;
        }
        else if (dimColStep) {
            dimColStep = Math.min(dataTableColCount, dimColStep);
            count = Math.ceil(dataTableColCount / dimColStep);
            colStep = dimColStep;
        }
        else {
            count = dataTableColCount;
            colStep = 1;
        }

        return {
            count: count,
            colStep: colStep,
            seriesDim: this.getSeriesDim()
        };
    };

    /**
     * @pubilc
     */
    methods.getSeriesDim = function () {
        return this.getType() === constant.JSDATA_ARRAY_OBJECT
            ? 2
            : (this.getDimColStep() ? 2 : 1);
    };

    /**
     * @public
     */
    methods.getPropertyMetas = function () {
        return dtLib.clone(this._dataMeta.propertyMetas);
    };

    /**
     * @pubilc
     */
    methods.getRowCount = function (rowBuffer) {
        var rowMax = 0;
        var jsData = this();

        // Get rowMax
        for (var k = 0, lenk = jsData.length; k < lenk; k++) {
            var oneSeriesData = jsData[k] || [];
            if (rowMax < oneSeriesData.length) {
                rowMax = oneSeriesData.length;
            }
        }

        if (rowBuffer == null) {
            rowBuffer = 2;
        }
        return rowMax + rowBuffer;
    };

    /**
     * @pubilc
     */
    methods.getColCount = function (colBuffer) {
        var colMax = 0;
        var seriesDim = this.getSeriesDim();
        var jsData = this();

        // Get colMax
        if (seriesDim === 1) {
            colMax = jsData.length;
        }
        else {
            var dimColStep = this.getDimColStep();
            // Find max length.
            colMax = dimColStep === 'max'
                ? getColMax[this.type()](jsData)
                : jsData.length * dimColStep;
        }

        if (colBuffer == null) {
            colBuffer = 2;
        }
        return colMax + colBuffer;
    };


    var getColMax = {};

    getColMax[constant.JSDATA_DIM_ARRAY] = function (jsData) {
        // Find max length.
        var colMax = 0;
        var oneSeriesData = jsData[0] || [];
        for (var j = 0, lenj = oneSeriesData.length; j < lenj; j++) {
            var line = oneSeriesData[j] || [];
            if (colMax < line.length) {
                colMax = line.length;
            }
        }
        return colMax;
    };

    getColMax[constant.JSDATA_ARRAY_OBJECT] = function (jsData) {
        // Find max length.
        var colMax = 0;
        var arrayObject = jsData[0] || [];
        for (var j = 0, lenj = arrayObject.length; j < lenj; j++) {
            var obj = arrayObject[j] || {};
            var propertyCount = helper.objectPropertyCount(obj);
            if (colMax < propertyCount) {
                colMax = propertyCount;
            }
        }
        return colMax;
    };

    return jsDataFactory;
});
