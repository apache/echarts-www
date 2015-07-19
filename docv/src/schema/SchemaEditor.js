/**
 * api doc sample
 */
define(function (require) {

    var $ = require('jquery');
    var Component = require('dt/ui/Component');
    var schemaHelper = require('../common/schemaHelper');
    var dtLib = require('dt/lib');
    var docUtil = require('../common/docUtil');
    var dialog = require('dt/ui/dialog');
    var editDataMgr = require('./editDataMgr');

    require('dt/componentConfig');

    var SCHEMA_URL = '../data/schema/optionSchema.json';
    var TPL_TARGET = 'SchemaEditor';
    var SELECTOR_COLLAPSE_RADIO = '.query-collapse-radio input[type=radio]';
    var SELECTOR_DESC_RENDERED_CN = '.desc-rendered-cn';
    var SELECTOR_DESC_RENDERED_EN = '.desc-rendered-en';
    var SELECTOR_QUESTION = '.ecdoc-question';
    var SELECTOR_SCHEMA_PATH = '.ecdoc-scmedt-schema-path';
    var ATTR_TIP_TPL_TARGET = 'data-tip-tpl';

    /**
     * 编辑端入口
     *
     * @class
     * @extends dt/ui/Component
     */
    var SchemaEditor = Component.extend({

        _define: {
            tpl: require('tpl!./SchemaEditor.tpl.html'),
            css: 'ecdoc-scmedt',
            viewModel: function () {
                return {
                    schemaTreeDatasource: null,
                    schemaTreeSelected: dtLib.ob(),
                    schemaTreeHighlighted: dtLib.obArray()
                };
            }
        },

        _prepare: function () {
            var viewModel = this._viewModel();

            viewModel.schemaTreeDatasource = [];

            // definition
            // oneOfParent
            // addArrayItem
            // addProperty

            var valueTypes = viewModel.valueTypes = [];
            for (var i = 0, len = schemaHelper.EC_OPTION_TYPE.length; i < len; i++) {
                var item = schemaHelper.EC_OPTION_TYPE[i];
                valueTypes.push({value: item, text: item});
            }

            $.getJSON(SCHEMA_URL, $.proxy(this._handleSchemaLoaded, this));
        },

        _handleSchemaLoaded: function (schema) {
            editDataMgr.init(schema);

            this._viewModel().schemaTreeDatasource = [editDataMgr.getSchemaRenderTree()];
            this._applyTpl(this.$el(), TPL_TARGET);

            this._initEditPanel();
            this._initTimeline();
            this._initDescViewHTML();
            this._initQuery();
            this._initTip();
        },

        _initEditPanel: function () {
            // 首先挂载写入事件
            var editInputs = this._sub('editBlock');
            for (var prop in editInputs) {
                if (editInputs.hasOwnProperty(prop)) {
                    var persistentObName = this._editPanelDefine[prop].persistentObName;
                    if (persistentObName) {
                        editInputs[prop].viewModel(persistentObName).subscribe(
                            $.proxy(this._onEditInputChanged, this, prop)
                        );
                    }
                }
            }

            // 然后一些特定的其他事件
            // this._disposable(
            //     this._sub('editBlock.type').viewModel('checked').subscribe(onTypeSelected, this)
            // );

            // function onTypeSelected(val, ob) {
            //     if (dtLib.checkValueInfoForConfirmed(ob)) { // 只有用户点击才触发，程序设值不触发。
            //         this._resetEditPanel();
            //     }
            // }

            this._disposable(
                this._viewModel().schemaTreeSelected.subscribe(this._resetEditPanel, this)
            );

            this._resetEditPanel();
        },

        /**
         * 所有刷新
         */
        _refreshBySchema: function (options) {
            this._viewModel().schemaTreeDatasource = [editDataMgr.getSchemaRenderTree()];
            this.recreateSubCpt('schemaTree');

            this._resetEditPanel();
            if (options && options.selectedValue) {
                var selOb = this._viewModel().schemaTreeSelected;
                selOb(options.selectedValue);
            }
        },

        /**
         * 所有edit reset的入口
         */
        _resetEditPanel: function () {
            this._resetEditEnable();
            this._resetEditRead();
        },

        _resetEditEnable: function () {
            var isTreeSelecting = this._isTreeSelecting();
            var treeItem = this._viewModel().schemaTreeSelected.getTreeDataItem(true);

            var editInputs = this._sub('editBlock');
            for (var name in editInputs) {
                if (editInputs.hasOwnProperty(name)) {
                    editInputs[name].viewModel('disabled')(
                        !isTreeSelecting
                            || !this._editPanelDefine[name].isEnabled(editInputs[name], treeItem)
                    );
                }
            }
            this._sub('descViewTypeCN').viewModel('disabled')(!isTreeSelecting);
            this._sub('descViewTypeEN').viewModel('disabled')(!isTreeSelecting);

            var typeOb = this._sub('editBlock.type').viewModel('checked');
            var types = docUtil.normalizeToArray(typeOb());
            var treeSelectValue = this._viewModel().schemaTreeSelected();
            var isOnRoot = editDataMgr.isOnRoot(treeSelectValue);

            this._sub('manipulator.addArrayItem').viewModel('visible')(
                isTreeSelecting && types.length === 1 && types[0] === 'Array'
            );
            this._sub('manipulator.addObjectProperty').viewModel('visible')(
                isTreeSelecting && types.length === 1 && types[0] === 'Object'
            );
            this._sub('manipulator.addDefinition').viewModel('visible')(
                isTreeSelecting && isOnRoot
            );
            this._sub('manipulator.addOneOf').viewModel('visible')(
                isTreeSelecting && !isOnRoot
            );
        },

        _resetEditRead: function () {
            var treeItem = this._viewModel().schemaTreeSelected.getTreeDataItem(true);
            if (treeItem) {
                for (var key in this._editPanelDefine) {
                    if (this._editPanelDefine.hasOwnProperty(key)) {
                        var o = this._editPanelDefine[key];
                        o.reader.call(this, this._sub('editBlock.' + key), treeItem);
                    }
                }

                this.$el().find(SELECTOR_SCHEMA_PATH)[0].innerHTML =
                    'Path: ' + treeItem.schemaPath.join('.');
            }
        },

        _onEditInputChanged: function (prop, val, ob) {
            if (dtLib.checkValueInfoForConfirmed(ob)) {
                try {
                    var dataItem = this._viewModel().schemaTreeSelected.getTreeDataItem(true);
                    var writer = this._editPanelDefine[prop].writer;
                    writer(val, dataItem);
                }
                catch (e) {
                    docUtil.log('error input: ' + prop + ' = ' + val);
                }
            }
        },

        _initTimeline: function () {
            // Undo and redo
            editDataMgr.subscribeTimelineMove(onTimelineMove, this);
            resetBtns.call(this);

            this._sub('undo').on('click', dtLib.curry(editDataMgr.timelineJump, -1));
            this._sub('redo').on('click', dtLib.curry(editDataMgr.timelineJump, 1));

            function onTimelineMove(args) {
                resetBtns.call(this);
                this._refreshBySchema(args);
            }

            function resetBtns() {
                this._sub('undo').viewModel('disabled')(!editDataMgr.canTimelineJump(-1));
                this._sub('redo').viewModel('disabled')(!editDataMgr.canTimelineJump(1));
            }
        },

        _isTreeSelecting: function () {
            return this._viewModel().schemaTreeSelected() != null;
        },

        _initDescViewHTML: function () {
            this._sub('descViewTypeCN').viewModel('checked').subscribe($.proxy(onHTMLViewChanged, this, 'cn'));
            this._sub('descViewTypeEN').viewModel('checked').subscribe($.proxy(onHTMLViewChanged, this, 'en'));

            function onHTMLViewChanged(type, nextValue) {
                var renderedEl = this.$el().find(
                    type === 'cn' ? SELECTOR_DESC_RENDERED_CN : SELECTOR_DESC_RENDERED_EN
                );
                var rawCptVisible = this._sub('editBlock.desc' + type.toUpperCase()).viewModel('visible');
                if (nextValue === 'rendered') {
                    renderedEl.show();
                    rawCptVisible(false);
                }
                else {
                    renderedEl.hide();
                    rawCptVisible(true);
                }
            }
        },

        _initTip: function () {
            var that = this;
            this.$el().find(SELECTOR_QUESTION).on('click', function () {
                dialog.alert({
                    content: that._renderTpl($(this).attr(ATTR_TIP_TPL_TARGET)),
                    encodeHTML: false
                });
            });
        },

        _initQuery: function () {
            var queryInput = this._sub('queryInput');
            queryInput.viewModel('value').subscribe(this._query, this);

            $(document).keypress(function (e) {
                var tagName = (e.target.tagName || '').toLowerCase();
                if (e.which === 47 && tagName !== 'input' && tagName !== 'textarea') { // "/"键
                    queryInput.focus();
                    queryInput.select();
                    e.preventDefault();
                }
            });
        },

        _query: function (text) {
            if (text == null || !$.trim(text)) {
                return;
            }
            var valueList = [];

            this._sub('schemaTree').travelData(
                {preChildren: visitItem}
            );

            function visitItem(dataItem) {
                if ((dataItem.itemName || '').toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                    valueList.push(dataItem.value);
                }
            }
            this._viewModel().schemaTreeHighlighted(
                valueList, {collapseLevel: 1, scrollToTarget: {clientX: 30}}
            );
        },

        /**
         * 检索并对应到树的相应选项上
         * queryStr like 'series[i](applicable:pie,line).itemStyle.normal.borderColor'
         */
        doQuery: function (queryStr, queryArgName) {
            var result;

            try {
                var args = {};
                args[queryArgName] = queryStr;
                result = schemaHelper.queryDocTree(editDataMgr.getSchemaRenderTree(), args);
            }
            catch (e) {
                alert(e);
                return;
            }

            var collapseLevel = null;
            $(SELECTOR_COLLAPSE_RADIO).each(function () {
                if (this.checked && this.value === '1') {
                    collapseLevel = 2;
                }
            });

            if (!result.length) {
                alert('没有检索到。queryStr="' + queryStr + '"');
                return;
            }

            var valueSet = [];
            for (var i = 0, len = result.length; i < len; i++) {
                valueSet.push(result[i].value);
            }

            this._viewModel().schemaTreeHighlighted(
                valueSet, {scrollToTarget: {clientX: 30}, collapseLevel: collapseLevel}
            );

            console.log(result);
        },

        _editPanelDefine: {
            propertyName: {
                isEnabled: function (cpt, treeItem) {
                    return treeItem
                        && !editDataMgr.isOnRoot(treeItem.value)
                        && treeItem.editable.propertyName;
                },
                reader: function (cpt, treeItem) {
                    cpt.viewModel('value')(treeItem.itemName);
                },
                persistentObName: 'value',
                writer: function (val, dataItem) {
                    var path = dataItem.schemaPath.slice();
                    editDataMgr.renamePropertySchemaDataItem(path, val);
                }
            },
            type: {
                isEnabled: function (cpt, treeItem) {
                    return treeItem
                        && !editDataMgr.isOnRoot(treeItem.value)
                        && treeItem.editable.type;
                },
                reader: function (cpt, treeItem) {
                    var type = treeItem.type;
                    if (!type) {
                        type = [];
                    }
                    else if (!$.isArray(type)) {
                        type = [type];
                    }
                    cpt.viewModel('checked')(type);
                },
                persistentObName: 'checked',
                writer: dtLib.curry(defaultPropertyWriter, 'type', 'type')
            },
            applicable: {
                isEnabled: function (cpt, treeItem) {
                    return !!treeItem;
                },
                reader: function (cpt, treeItem) {
                    var list = docUtil.normalizeToArray(treeItem.applicable);
                    cpt.viewModel('value')(list.join(','));
                },
                persistentObName: 'value',
                writer: dtLib.curry(defaultPropertyWriter, 'applicable', 'applicable')
            },
            enumerateBy: {
                isEnabled: function (cpt, treeItem) {
                    return !!treeItem;
                },
                reader: function (cpt, treeItem) {
                    var list = docUtil.normalizeToArray(treeItem.enumerateBy);
                    cpt.viewModel('value')(list.join(','));
                },
                persistentObName: 'value',
                writer: dtLib.curry(defaultPropertyWriter, 'enumerateBy', 'enumerateBy')
            },
            setApplicable: {
                isEnabled: function (cpt, treeItem) {
                    return !!treeItem;
                },
                reader: function (cpt, treeItem) {
                    var list = docUtil.normalizeToArray(treeItem.setApplicable);
                    cpt.viewModel('value')(list.join(','));
                },
                persistentObName: 'value',
                writer: dtLib.curry(defaultPropertyWriter, 'setApplicable', 'setApplicable')
            },
            ref: {
                isEnabled: function (cpt, treeItem) {
                    return !!treeItem;
                },
                reader: function (cpt, treeItem) {
                    cpt.viewModel('value')(treeItem.ref || '');
                },
                persistentObName: 'value',
                writer: dtLib.curry(defaultPropertyWriter, 'ref', 'ref')
            },
            defaultValue: {
                isEnabled: function (cpt, treeItem) {
                    return !!treeItem;
                },
                reader: function (cpt, treeItem) {
                    cpt.viewModel('value')(stringifyValue(treeItem.defaultValue));
                },
                persistentObName: 'value',
                writer: dtLib.curry(defaultPropertyWriter, 'default', 'defaultValue')
            },
            defaultExplanation: {
                isEnabled: function (cpt, treeItem) {
                    return !!treeItem;
                },
                reader: function (cpt, treeItem) {
                    cpt.viewModel('value')(treeItem.defaultExplanation || '');
                },
                persistentObName: 'value',
                writer: dtLib.curry(defaultPropertyWriter, 'defaultExplanation', 'defaultExplanation')
            },
            descCN: {
                isEnabled: function (cpt, treeItem) {
                    return !!treeItem;
                },
                reader: function (cpt, treeItem) {
                    var html = treeItem.descriptionCN || '';
                    cpt.viewModel('value')(html);
                    this.$el().find(SELECTOR_DESC_RENDERED_CN)[0].innerHTML = html;
                },
                persistentObName: 'value',
                writer: dtLib.curry(defaultPropertyWriter, 'descriptionCN', 'descriptionCN')
            },
            descEN: {
                isEnabled: function (cpt, treeItem) {
                    return !!treeItem;
                },
                reader: function (cpt, treeItem) {
                    var html = treeItem.descriptionEN || '';
                    cpt.viewModel('value')(html);
                    this.$el().find(SELECTOR_DESC_RENDERED_EN)[0].innerHTML = html;
                },
                persistentObName: 'value',
                writer: dtLib.curry(defaultPropertyWriter, 'descriptionEN', 'descriptionEN')
            }
        }

    });

    function stringifyValue(value) {
        try {
            return JSON.stringify(value);
        }
        catch (e) {
        }
        return value + '';
    }

    function defaultPropertyWriter(schemaItemPropertyName, dataItemPropertyName, val, dataItem) {
        var path = dataItem.schemaPath.slice();
        path.push(schemaItemPropertyName);
        editDataMgr.updateSchemaDataItem(path, val);
    }

    return SchemaEditor;
});