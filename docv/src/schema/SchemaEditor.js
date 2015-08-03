/**
 * @file Schema Editor
 * @author sushuang@baidu.com
 */
define(function (require) {

    var $ = require('jquery');
    var Component = require('dt/ui/Component');
    var schemaHelper = require('../common/schemaHelper');
    var dtLib = require('dt/lib');
    var docUtil = require('../common/docUtil');
    var dialog = require('dt/ui/dialog');
    var editDataMgr = require('./editDataMgr');
    var editPanelDefine = require('./editPanelDefine');

    require('dt/componentConfig');

    var SCHEMA_URL = '../data/schema/optionSchema.json';
    var TPL_TARGET = 'SchemaEditor';
    var TPL_TARGET_SHOW_ALL_APPLICABLE = 'showAllApplicable';
    var SELECTOR_COLLAPSE_RADIO = '.query-collapse-radio input[type=radio]';
    var SELECTOR_DESC_RENDERED_CN = '.desc-rendered-cn';
    var SELECTOR_DESC_RENDERED_EN = '.desc-rendered-en';
    var SELECTOR_QUESTION = '.ecdoc-question';
    var SELECTOR_SCHEMA_PATH = '.ecdoc-scmedt-schema-path';
    var SELECTOR_EDIT_COUNT = '.ecdoc-scmedt-edit-count';
    var SELECTOR_GEN_SCHEMA = '.ecdoc-scmedt-gen-schema';
    var SELECTOR_SCHEMA_TEXT = '.ecdoc-scmedt-schema-text';
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
                    schemaTreeHighlighted: dtLib.obArray(),
                    valueTypes: null
                };
            }
        },

        _prepare: function () {
            var viewModel = this._viewModel();

            viewModel.schemaTreeDatasource = [];

            var valueTypes = viewModel.valueTypes = [];
            for (var i = 0, len = schemaHelper.EC_OPTION_TYPE.length; i < len; i++) {
                var item = schemaHelper.EC_OPTION_TYPE[i];
                valueTypes.push({value: item, text: item});
            }

            $.getJSON(
                SCHEMA_URL + '?_v_=' + Math.random(),
                $.proxy(this._handleSchemaLoaded, this)
            );
        },

        _handleSchemaLoaded: function (schema) {
            editDataMgr.init(schema);

            this._viewModel().schemaTreeDatasource = [editDataMgr.getSchemaRenderTree()];
            this._applyTpl(this.$el(), TPL_TARGET);

            this._initEditPanel();
            this._initGenSchema();
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
                    var persistentObName = editPanelDefine[prop].persistentObName;
                    if (persistentObName) {
                        editInputs[prop].viewModel(persistentObName).subscribe(
                            $.proxy(this._onEditInputChanged, this, prop, editInputs[prop])
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
            //         this._resetEditPanelAsync();
            //     }
            // }

            this._sub('showAllApplicable').on('click', $.proxy(this._showAllApplicable, this));

            this._disposable(
                this._viewModel().schemaTreeSelected.subscribe(this._resetEditPanelAsync, this)
            );

            this._resetEditPanelAsync();
        },

        _showAllApplicable: function () {
            var universal = editDataMgr.getSchemaStatistic().universal;
            dialog.alert({
                content: this._renderTpl(TPL_TARGET_SHOW_ALL_APPLICABLE, {
                    applicable: universal.applicable.list().sort().join(', '),
                    enumerateBy: universal.enumerateBy.list().sort().join(', '),
                    setApplicable: universal.setApplicable.list().sort().join(', ')
                }),
                encodeHTML: false
            });
        },

        _initGenSchema: function () {
            this.$el().find(SELECTOR_GEN_SCHEMA).on(
                this._event('click'), $.proxy(genSchema, this)
            );

            dialog.create({
                key: 'genShema',
                tplTarget: 'genSchema',
                afterInit: afterInit,
                dialogType: 'alert'
            });

            function afterInit($subContent) {
                $subContent.find(SELECTOR_SCHEMA_TEXT).on('mouseenter', function () {
                    this.select && this.select();
                });
            }

            function afterShow($subContent) {
                $subContent.find(SELECTOR_SCHEMA_TEXT).val(editDataMgr.getSchemaText());
            }

            function genSchema() {
                dialog.alert({
                    key: 'genShema',
                    afterShow: afterShow
                });
            }
        },

        /**
         * 所有刷新
         */
        _refreshBySchemaAsync: function (options) {
            if (!this.__refreshBySchemaAsync) {
                this.__refreshBySchemaAsync = dtLib.throttle(
                    $.proxy(this._refreshBySchemaImmediately, this), 0, true, true
                );
            }

            this.__refreshBySchemaAsync(options);
        },

        _refreshBySchemaImmediately: function (options) {
            this._viewModel().schemaTreeDatasource = [editDataMgr.getSchemaRenderTree()];
            this.recreateSubCpt('schemaTree');

            if (options && options.selectedValue) {
                // selectedValue可能改变了。（改变name时）
                var selOb = this._viewModel().schemaTreeSelected;
                selOb(options.selectedValue, null, {force: true});
                // 选中也会触发_resetEditPanelAsync，所以throttle了。
            }

            this._resetEditPanelAsync();
        },

        /**
         * 所有edit reset的入口
         */
        _resetEditPanelAsync: function () {
            if (!this.__resetEditPanelAsync) {
                this.__resetEditPanelAsync = dtLib.throttle(
                    $.proxy(this._resetEditPanelImmediately, this), 0, true, true
                );
            }

            this.__resetEditPanelAsync();
        },

        _resetEditPanelImmediately: function () {
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
                            || !editPanelDefine[name].isEnabled(editInputs[name], treeItem)
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
            for (var key in editPanelDefine) {
                if (editPanelDefine.hasOwnProperty(key)) {
                    var o = editPanelDefine[key];
                    o.reader.call(this, this._sub('editBlock.' + key), treeItem);
                }
            }

            if (treeItem) {
                this.$el().find(SELECTOR_SCHEMA_PATH)[0].innerHTML =
                    'Path: ' + treeItem.schemaPath.join('.');
            }
        },

        _onEditInputChanged: function (prop, cpt, val, ob) {
            if (dtLib.checkValueInfoForConfirmed(ob)) {
                try {
                    var dataItem = this._viewModel().schemaTreeSelected.getTreeDataItem(true);
                    var writer = editPanelDefine[prop].writer;
                    writer(cpt, val, dataItem);
                }
                catch (e) {
                    docUtil.log('error: ' + prop + ' = ' + val);
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
                this._refreshBySchemaAsync(args);
            }

            function resetBtns() {
                this._sub('undo').viewModel('disabled')(!editDataMgr.canTimelineJump(-1));
                this._sub('redo').viewModel('disabled')(!editDataMgr.canTimelineJump(1));

                this.$el().find(SELECTOR_EDIT_COUNT)[0].innerHTML = ''
                    + 'Edit Record: '
                    + editDataMgr.getHistoryNextIndex()
                    + ' / '
                    + editDataMgr.getHistoryCount();
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
                valueList,
                {collapseLevel: 1, scrollToTarget: {clientX: 30}},
                {volatiles: ['scrollToTarget']}
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
                result = schemaHelper.queryDocTree(
                    editDataMgr.getSchemaRenderTree(),
                    editDataMgr.getSchemaStatistic().universal,
                    args
                );
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
                valueSet,
                {scrollToTarget: {clientX: 30}, collapseLevel: collapseLevel},
                {volatiles: ['scrollToTarget']}
            );

            docUtil.log(result);
        },

        _renderDescHTML: function (selector, html) {
            // 用ifr隔离，防止html出错扩散影响。
            this.$el().find(selector)[0].contentWindow.document.body.innerHTML = html;
        }

    });

    return SchemaEditor;
});