/**
 * @file data table processor
 * @author sushuang(sushuang@baidu.com)
 */
define(function (require) {

    var $ = require('jquery');
    var dtLib = require('dt/lib');
    var docUtil = require('../common/docUtil');
    var renderers = require('./dataTableCellRenderers');
    var helper = require('./helper');
    var constant = require('./constant');

    /**
     * @public
     */
    var processor = {};

    processor.getJSDataChangeHandler = function (mainListViewModels) {
        return function (jsData, jsDataOb) {
            // 自己引发的改变，不更新自己
            if (!dtLib.checkValueInfoForConfirmed(jsDataOb, constant.UI_CODE_INPUTS)) {
                fillFromJSData(jsDataOb, mainListViewModels);
            }
        };
    };

    /**
     * 此方法不做throttle，因为只用于监听ob。
     * 约定在ob更新的上游进行throttle（即dataTableProcessor.fillJSData）
     *
     * @inner
     * @param {Object} mainListViewModels
     */
    function fillFromJSData(jsDataOb, mainListViewModels) {
        var jsData = jsDataOb();

        // Clear
        mainListViewModels.removeAll();

        // Render
        var toAddArr = [];
        for (var seriesIndex = 0, lenS = jsData.length; seriesIndex < lenS; seriesIndex++) {
            var codeText = docUtil.stringifyJSObject(jsData[seriesIndex]);
            var codeTextOb = dtLib.ob(codeText);
            toAddArr.push({codeTextOb: codeTextOb});
            codeTextOb.subscribe(onCodeTextChange, processor);
        }
        toAddArr.length && mainListViewModels.pushArray(toAddArr);

        function onCodeTextChange(nextCodeText, codeTextOb) {
            if (dtLib.checkValueInfoForConfirmed(codeTextOb)) {
                processor.fillJSData(jsDataOb, mainListViewModels);
            }
        }
    }

    /**
     * 统一throttle而非在调用点throttle，是为了让所有此方法的调用有一致的时序。
     *
     * @public
     */
    processor.fillJSData = dtLib.throttle(fillJSData, constant.JSDATA_UPDATE_DELAY, true, true);

    /**
     * @public
     * @param {Object} mainListViewModels
     */
    function fillJSData(jsDataOb, mainListViewModels) {
        var jsData = [];
        var vms = mainListViewModels();
        var colCount = jsDataOb.getColCount();
        var seriesInfo = jsDataOb.getSeriesInfo(colCount);
        var jsDataType = jsDataOb.getType();

        // 取数据
        for (var seriesIndex = 0, lenS = vms.length; seriesIndex < lenS; seriesIndex++) {
            var oneCode = helper.parseToArray(vms[seriesIndex].codeTextOb(), true) || [];
            var oneSeries = [];

            for (var rowIndex = 0, lenR = oneCode.length; rowIndex < lenR; rowIndex++) {
                var oneCodeItem = oneCode[rowIndex];
                var line;

                if (jsDataType === constant.JSDATA_DIM_ARRAY) {
                    line = seriesInfo.seriesDim === 2
                       ? (!$.isArray(oneCodeItem) ? [] : oneCodeItem)
                       : oneCodeItem;
                }
                else { // jsDataType === constant.JSDATA_DIM_ARRAY
                    line = $.isPlainObject(oneCodeItem) ? oneCodeItem : {};
                }
                oneSeries.push(line);
            }
            jsData.push(oneSeries);
        }

        jsDataOb(jsData, dtLib.valueInfoForConfirmed(constant.UI_CODE_INPUTS));
    }

    /**
     * @public
     */
    processor.processCell = function (colSettings, htIns, row, col) {
        var colCount = htIns.countCols();
        var jsDataOb = htIns.jsDataOb;
        var seriesInfo = jsDataOb.getSeriesInfo(colCount);

        if (seriesInfo.colStep > 1) {
            if (Math.floor(col / seriesInfo.colStep) % 2 === 0) {
                colSettings.renderer = renderers.high;
            }
            else {
                colSettings.renderer = renderers.normal;
            }
        }
        else { // 两个else分开写是为了逻辑上好读。
            colSettings.renderer = renderers.normal;
        }
    };

    return processor;
});
