/**
 * API doc.
 */
define(function (require) {

    var $ = require('jquery');
    var Component = require('dt/ui/Component');
    var dtLib = require('dt/lib');
    var lang = require('./lang');

    require('dt/componentConfig');

    var SELECTOR_DATA_TABLE = '.ecdoc-sprsht-data-table';

    /**
     * @public
     * @type {Object}
     */
    var spreadsheet = {};

    /**
     * @public
     */
    spreadsheet.init = function () {
        var instance = new SpreadsheetMain($('.ecdoc-sprsht')); // jshint ignore:line
    };

    /**
     * @class
     * @extends dt/ui/Component
     */
    var SpreadsheetMain = Component.extend({

        _define: {
            tpl: require('tpl!./spreadsheet.tpl.html'),
            tplTarget: 'SpreadsheetMain',
            css: 'ecdoc-sprsht',
            viewModel: function () {
                return {
                };
            }
        },

        getLang: function () {
            return lang;
        },

        _initDataTable: function () {
            var options = {
                cells: function () {
                    // 此函数将在循环体中被频繁调用。（每次更改handsontable时调用）
                    if (that._currProcessor) {
                        that._currProcessor.cells.apply(
                            that._currProcessor,
                            [this].concat(lib.arraySlice(arguments))
                        );
                    }
                },
                afterChange: function (change, source) {
                    // source可为：
                    // "alter", "empty", "edit", "populateFromArray", "loadData", "autofill", "paste"
                    // 其中 alter, empty目前不知含义
                    // 原则：只有loadData认为是不用执行持久化

                    if (source === 'loadData') {
                        return;
                    }
                    that.afterChange(change);
                },
                afterCreateRow: function (index, amount) {
                    that._isDispatchable() && that._currProcessor.afterCreateRow(
                        that._htIns, that.getWgtId(), index, amount
                    );
                },
                afterCreateCol: function (index, amount) {
                    that._isDispatchable() && that._currProcessor.afterCreateCol(
                        that._htIns, that.getWgtId(), index, amount
                    );
                },
                afterRemoveRow: function (index, amount) {
                    that._isDispatchable() && that._currProcessor.afterRemoveRow(
                        that._htIns, that.getWgtId(), index, amount
                    );
                },
                afterRemoveCol: function (index, amount) {
                    that._isDispatchable() && that._currProcessor.afterRemoveCol(
                        that._htIns, that.getWgtId(), index, amount
                    );
                },
                afterSelection: function () {
                    refreshRowColHeadHighlight(this.view.wt);
                },
                afterDeselect: function () {
                    clearRowColHeadHighlight(this.view.wt);
                },
                afterRender: function () {
                    refreshRowColHeadHighlight(this.view.wt);
                },
                minSpareRows: 1,
                minSpareCols: 1,
                rowHeaders: true,
                colHeaders: true,
                contextMenu: true,
                stretchH: 'last', // 设为'all'时，列拖拽改变宽度时体验稍有问题。
                // width: function //??
                // height: function //??
                minRows: 50,
                minCols: 12,
                manualColumnResize: true,
                manualColumnMove: false,
                fillHandle: true,
                undo: true,
                outsideClickDeselects: true,
                enterBeginsEditing: true,
                autoWrapCol: false,
                autoWrapRow: false,
                copyRowsLimit: 600000, // 此设定是否合理??
                copyColsLimit: 600000, // 此设定是否合理??
                pasteMode: 'overwrite',
                columnSorting: false,
                persistentState: false,
                data: [[]] // 初始数据
            };

            var $dataTable = this.$el('dataTable', this.$el().find(SELECTOR_DATA_TABLE));
            var htIns = this._htIns = dataProcessor.createHandsontable($editor, options);

            $dataTable.on(
                this._event('click'),
                'table.htCore thead th',
                function (event) {
                }
            );
            $dataTable.on(
                this._event('click'),
                'table.htCore tbody th',
                function (event) {
                }
            );
        }

    });

    return spreadsheet;
});
