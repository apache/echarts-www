/**
 * API doc.
 */
define(function (require) {

    var $ = require('jquery');
    var Component = require('dt/ui/Component');
    var dtLib = require('dt/lib');
    var lang = require('./lang');
    var constant = require('./constant');
    var jsDataFactory = require('./jsDataFactory');

    require('./componentConfig');
    require('jqueryhandsontable');
    require('jquerymousewheel');

    // Constant
    var INIT_ATTR_INPUT_NUMBER = 4;
    var DEFAULT_ATTR = ['name', 'age', 'sex', 'class'];
    var SELECTOR_ATTR_SETTING_AREA = '.ecdoc-sprsht-attr-setting';
    var SELECTOR_DIM_SETTING_AREA = '.ecdoc-sprsht-dim-setting';
    var DEFAULT_ATTR_DATA_TYPE = 'auto';

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
                    jsDataOb: jsDataFactory.create(),
                    attrInfoListOb: dtLib.obArray([])
                };
            }
        },

        _init: function () {
            this._initDetailSetting();
            this._initDimSetting();
            this._initAttrSetting();

            this._showHideSettingArea(constant.JSDATA_DIM_ARRAY);
        },

        _initDetailSetting: function () {
            var jsDataOb = this._viewModel().jsDataOb;

            var handlers = {
                emptyValue: function (emptyValue) {
                    jsDataOb.setEmptyValue(emptyValue);
                    jsDataOb.fillJSDataByDataTable();
                },
                quotationMark: function (value) {
                    jsDataOb.setCodeInfo({'quotationMark': value});
                    jsDataOb.fillJSDataByDataTable();
                },
                jsDataType: function (jsDataType) {
                    jsDataOb.setType(jsDataType);
                    jsDataOb.fillJSDataByDataTable();
                    this._sub('dataTable').refresh();
                    this._showHideSettingArea(jsDataType);
                },
                codeFormat: function (value) {
                    var codeInfoMapping = {
                        compressed: {
                            compress: true,
                            indentBase: null
                        },
                        expanded2Indent: {
                            compress: false,
                            indentBase: 2
                        },
                        expanded4Indent: {
                            compress: false,
                            indentBase: 4
                        }
                    }
                    jsDataOb.setCodeInfo(codeInfoMapping[value]);
                    jsDataOb.fillJSDataByDataTable();
                }
            };

            for (var key in handlers) {
                if (handlers.hasOwnProperty(key)) {
                    this._disposable(
                        this._sub(key).viewModel('checked').subscribe(handlers[key], this)
                    );
                }
            }
        },

        _initDimSetting: function () {
            var jsDataOb = this._viewModel().jsDataOb;
            this._disposable(
                this._sub('dimColStep').viewModel('checked').subscribe(onDimColStepChanged, this)
            );

            function onDimColStepChanged(dimColStep) {
                jsDataOb.setDimColStep(dimColStep);
                jsDataOb.fillJSDataByDataTable();
                this._sub('dataTable').refresh();
            }
        },

        _initAttrSetting: function () {
            var viewModel = this._viewModel();
            var attrInfoListOb = viewModel.attrInfoListOb;
            var jsDataOb = viewModel.jsDataOb;
            var that = this;

            attrInfoListOb.subscribe(onAttrChange);

            // Set default value
            var vms = [];
            for (var i = 0; i < INIT_ATTR_INPUT_NUMBER; i++) {
                vms.push(makeAttrInfoViewModel(DEFAULT_ATTR[i], i));
            }
            attrInfoListOb.pushArray(vms);

            // Add and remvoe
            this._sub('addAttrInput').on('click', $.proxy(addAttrInput, this));
            this._sub('removeAttrInput').on('click', $.proxy(removeAttrInput, this));

            function addAttrInput() {
                var count = attrInfoListOb.count();
                attrInfoListOb.push(makeAttrInfoViewModel('attr' + count, count));
            }

            function removeAttrInput() {
                if (attrInfoListOb.count() > 1) {
                    attrInfoListOb.pop();
                }
            }

            function makeAttrInfoViewModel(text, index) {
                var valueOb = dtLib.ob(text);
                valueOb.subscribe(onAttrChange);
                var itemDataTypeOb = dtLib.ob(DEFAULT_ATTR_DATA_TYPE);
                itemDataTypeOb.subscribe(onAttrChange);

                return {
                    mouseEnterSelect: dtLib.ob(true),
                    value: valueOb,
                    itemDataType: itemDataTypeOb,
                    title: dtLib.ob('')
                };
            }

            function onAttrChange() {
                var vms = attrInfoListOb();
                var metas = [];
                for (var i = 0, len = vms.length; i < len; i++) {
                    metas.push({
                        propertyName: vms[i].value(),
                        itemDataType: vms[i].itemDataType()
                    });
                }

                jsDataOb.setPropertyMetas(metas);
                jsDataOb.fillJSDataByDataTable();
                that._sub('dataTable').refresh();
                refreshAttrItemTitle();
            }

            function refreshAttrItemTitle() {
                var attrs = attrInfoListOb();
                for (var i = 0, len = attrs.length; i < len; i++) {
                    var colArr = jsDataOb.getColDescInSeries(
                        [0, 1, 2], i, constant.JSDATA_ARRAY_OBJECT
                    );
                    attrs[i].title(dtLib.strTemplate(
                        lang.attrInfoTitle,
                        // {colName: '<em>' + colArr.join('</em>/<em>') + '</em>/...'}
                        {colName: colArr.join('/') + '/...'}
                    ));
                }
            }
        },

        _showHideSettingArea: function (jsDataType) {
            var $el = this.$el();
            $el.find(SELECTOR_ATTR_SETTING_AREA)[
                jsDataType === constant.JSDATA_DIM_ARRAY ? 'hide' : 'show'
            ]();
            $el.find(SELECTOR_DIM_SETTING_AREA)[
                jsDataType === constant.JSDATA_DIM_ARRAY ? 'show' : 'hide'
            ]();
        }
    });

    return spreadsheet;
});
